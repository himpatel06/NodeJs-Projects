import express,{Request,Response,NextFunction} from 'express';
import func from '../library/functions';
import * as validator from '../middleware/validator';
import authenticate from '../middleware/jwt-authentication';
import scheduleModel from '../model/schedule';
import appointmnetModel from '../model/appointmnet';
import serviceModel from '../model/service';
import Connection from '../library/connection';
import * as schema from '../library/schema'


const router = express.Router();

//Customer Routers
router.post('/book-appointment/',validator.scheduleValidation,authenticate('customer'),bookAppointment);
router.get('/view-all-appointments',authenticate('customer'),viewAllAppointments);
router.get('/view-appointment-customer',validator.appointment_idValidator,authenticate('customer'),getAppointmentByIdByCustomer);
router.get('/view-upcoming-appointment',authenticate('customer'),viewUpcomingAppointment);
router.get('/view-completed-appointment',authenticate('customer'),getCompletedAppointment)

//Instructor Router
router.get('/view-instructor-appointment',authenticate('instructor'),getAllAppointMentByIID)
router.get('/view-appointment-intructor',validator.appointment_idValidator,authenticate('instructor'),getAppointmentByIdandI_Id)
router.get('/get-pending-appointment',authenticate('instructor'),getPendingApproval)
router.get('/update-approval',validator.approvalValidator,authenticate('instructor'),updateApprovalByInstructor)



 //################ CUTOMER FUNCTION #################
async function bookAppointment(req:Request,res:Response){
    const customer = (req as any).customer;
    const {schedule_time_id,schedule_day_id,instructor_id,date} = req.body;
    
    const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = new Date(date).getDay();
    const dayName = weeks[day];

    const getScheduleDay = await scheduleModel.getScheduleDayById(schedule_day_id);
    if(!getScheduleDay || getScheduleDay.error || getScheduleDay.data.length === 0)
    return res.status(400).json(func.output(true,'Invalid Schedule_day_id defined'));

    if(getScheduleDay.data[0].available_day !== dayName || !getScheduleDay.data[0].avaibility)
    return res.status(400).json(func.output(true,'Schedule is not available on '+date));

    //check if the schedule is available or not. No Concorent Booking
    let getSchedule = await scheduleModel.getScheduleTimeById(+schedule_time_id);
    if(getSchedule?.error || getSchedule?.data.length ===0)
    return res.status(400).json(func.output(true,'Invalid Schedule defined'));


    //already somebody bookingAppointment
    if(getSchedule?.data[0].status ==='pending' || getSchedule?.data[0].status ==='booked'){
        return res.status(400).json(func.output(true,'Schedule Currently Not Available'));
    }
    

    //schedule is available for booking
    else{
         let status = 'pending';

         //Setting timmer for 2mins if appointment is booked or not
         setTimeout(async()=>{
            if(status === 'pending'){
                await scheduleModel.updateScheduleStatus(+schedule_time_id,'not booked');
                console.log('Changeed Status to not booked in 10sec');
            }
            else{
                console.log('no change')
            }
        },2*60*1000);
        

        //changing status to pending
        const changeStatus = await scheduleModel.updateScheduleStatus(+schedule_time_id,status);
        if(changeStatus?.error) return res.status(400).json(func.output(true,changeStatus?.message));

    
       await Connection.clientConn.query('BEGIN');
        let paymentStatus = true; // payment made successfull

        if(paymentStatus){
            
            const getServicePrice = await serviceModel.getSerivePrice(schedule_day_id);
           
           //Adding Entry to Appointment
            const bookAppointment = await appointmnetModel.bookAppontment(schedule_day_id,schedule_time_id,instructor_id,getServicePrice?.data[0].price,customer.c_id,date,true);
            if(bookAppointment?.error) {
               await Connection.clientConn.query('ROLLBACK');
                return res.status(400).json(func.output(true,bookAppointment?.message));
            }

            //Changing Status to Booked in Schedule Table
            const scheduleStatus = await scheduleModel.updateScheduleStatus(+schedule_time_id,'booked',true);

            if(scheduleStatus?.error){
               await Connection.clientConn.query('ROLLBACK');
                return res.status(400).json(func.output(true,scheduleStatus?.message));
            }

            else {
                status = 'booked';
                await Connection.clientConn.query('COMMIT');
                return  res.status(200).json(func.output(false,"Appointment Booked Successfully"));
            }

        }
        //If transection Fail
        else{
            await Connection.clientConn.query('ROLLBACK');
            return res.status(400).json(func.output(true,"Booking Failed."));
        }


    }
    
}

async function viewAllAppointments(req:Request,res:Response){

    const customer = (req as any).customer;
    const temp = Number(req.query.page);
    const page = (isNaN(temp) || temp <=0) ? 1:temp;
    const limit = 5;
    //########### GET ALL APPOINTMENTS BY CUSTOMER ID //###########
    const getAppointment = await appointmnetModel.viewAllAppointment(customer.c_id,page,limit);
    if(getAppointment?.error || !getAppointment|| !getAppointment.data) return res.status(400).json(func.output(true,"Failed Getting all Appointment"));

    let data:any[]=[];
    const appointment:any[] = getAppointment.data;

    //########### STORING IT IN RESPONSE DATA //###########
    appointment.forEach((value)=>{
        const setDate = value.schedule_date.toISOString().split('T')[0];
        const details = {
            'appointment_id':value.appointment_id,
            'amount':value.amount,
            'approval':value.approval,
            'status':value.appointment_status,
            'Details':{
                'date':setDate,
                'day':value.available_day,
                'Start At':value.start_time,
                'End At':value.end_time
            }
        }
        data.push(details);
    })
     
    return res.status(200).json(func.output(false,"Get All Appointments",data));


}

async function viewUpcomingAppointment(req:Request,res:Response) {
    const customer = (req as any).customer;

    //########### GET UPCOMING APPOINTMENTS BY CUSTOMER ID //###########
    const getAppointment = await appointmnetModel.viewAllAppointment(customer.c_id);
    if(getAppointment?.error || !getAppointment|| !getAppointment.data) return res.status(400).json(func.output(true,"Failed Getting all Appointment"));

    let data
    const appointment:any[] = getAppointment.data;

    //########### STORING IT IN RESPONSE DATA //###########
    appointment.forEach((value)=>{
        const setDate = value.schedule_date.toISOString().split('T')[0];

        //########### CHECK IF STATUS IS UPCOMMING //###########
        if(value.appointment_status ==='upcomming'){
        data = {
            'appointment_id':value.appointment_id,
            'amount':value.amount,
            'approval':value.approval,
            'status':value.appointment_status,
            'Details':{
                'date':setDate,
                'day':value.available_day,
                'Start At':value.start_time,
                'End At':value.end_time
            }
        }
    }
    })
     
    return res.status(200).json(func.output(false,"Get All Appointments",data));


}


    async function getCompletedAppointment(req:Request,res:Response) {
        const customer = (req as any).customer;
        
    //########### GET ALL APPOINTMENTS BY CUSTOMER ID //###########
        const getAppointment = await appointmnetModel.viewAllAppointment(customer.c_id);
        if(getAppointment?.error || !getAppointment|| !getAppointment.data) return res.status(400).json(func.output(true,"Failed Getting all Appointment"));

        let data
        const appointment:any[] = getAppointment.data;
        appointment.forEach((value)=>{
            const setDate = value.schedule_date.toISOString().split('T')[0];
            if(value.appointment_status ==='completed'){
            data = {
                'appointment_id':value.appintment_id,
                'amount':value.amount,
                'approval':value.approval,
                'status':value.appointment_status,
                'Details':{
                    'date':setDate,
                    'day':value.available_day,
                    'Start At':value.start_time,
                    'End At':value.end_time
                }
            }
        }
        })
        
        return res.status(200).json(func.output(false,"Get All Appointments",data));

    }
    async function getAppointmentByIdByCustomer(req:Request,res:Response){
        const {appointment_id} = req.body
        const c_id = (req as any).customer.c_id;

    //########### GET PERTICULARE APPOINTMENTS BY APPOINTMENT ID AND CUSTOMER ID //###########
        const getAppointment = await appointmnetModel.getAppointmentByIdandC_ID(appointment_id,c_id);
        if(!getAppointment || getAppointment.error)
        return res.status(400).json(func.output(true,"Failed Getting all Appointment"));

        if(getAppointment.data.length ===0){
            return res.status(400).json(func.output(true,"No Appointment found. Please Proper appiontment Id"));
        }

        const appointment = getAppointment.data[0];
        const setDate = appointment.schedule_date.toISOString().split('T')[0];

        let data:schema.customerAppointmentSchema={
            instructor_name:appointment.full_name,
            profession:appointment.profession_name,
            service_details:{
                name:appointment.service_name,
                desc:appointment.service_desc,
                price:appointment.price
            },
            schedule:{
                date:setDate,
                start_time:appointment.start_time,
                end_time:appointment.end_time
            }
        }
        res.status(200).json(func.output(false,"Get appointment by Id",data));
    }



 //################ INSTRUCTOR APPOINTMENT FUNCTIONS #################//

    async function getAllAppointMentByIID(req:Request,res:Response){
        const i_id = (req as any).instructor.i_id;

    //########### GET ALL APPOINTMENTS BY APPOINTMENT ID //###########
        const getAppointment = await appointmnetModel.getAppointmentByIID(i_id);
        if(getAppointment?.error)
        return  res.status(400).json(func.output(true,"Failed Getting all Appointment"));
    if(getAppointment?.data.length === 0){
        return  res.status(400).json(func.output(true,"No Appointment Found"));
    }
        let data:{
            total_Amount:number,
            pending_approval:any[],
            approved:any[]
        } = {
            total_Amount : 0,
            pending_approval:[],
            approved:[]
        }
        const appointment:any[] = getAppointment?.data;
        appointment.forEach(value=>{
            data.total_Amount +=value.amount;
            const setDate = value.schedule_date.toISOString().split('T')[0];
            const pending = {
                appointment_id :value.appointment_id,
                amount:value.amount,
                date:setDate,
                day:value.available_day
            }
            if(value.approval ==='pending'){
                data.pending_approval.push(pending)
            }
            else{
                data.approved.push(pending)
            }

        })
        return res.status(200).json(func.output(false,"Get All Appointments",data));
        

    }

    async function getAppointmentByIdandI_Id(req:Request,res:Response) {
        const {i_id} = (req as any).instructor;
        const {appointment_id} = req.body;
//################ GET PERTICULAR APPOINTMENT BY ID AND Instructor ID #################//
        const getAppointment = await appointmnetModel.getAppointmentByIdandI_ID(appointment_id,i_id);
        if(getAppointment?.error)
        return  res.status(400).json(func.output(true,"Failed Getting all Appointment"));

        if(getAppointment?.data.length === 0){
            return  res.status(400).json(func.output(true,"No Appointment Found. Enter Proper Appointment ID"));
        }
        
        const appointment = getAppointment?.data[0];
        const setDate = appointment.schedule_date.toISOString().split('T')[0];
        let data:schema.instructorAppointSchema={
            customer_detail:{
                Full_Name:appointment.full_name,
            },
            Service_detail:{
                name:appointment.service_name,
                price:appointment.price
            },
            schedule:{
                date:setDate,
                start_time:appointment.start_time,
                end_time:appointment.end_time
            },
            approval:appointment.approval
        }
        return res.status(200).json(func.output(false,"Get All Appointments",data));

        
    }

    async function getPendingApproval(req:Request,res:Response){
        const {i_id} = (req as any).instructor;
    
    //################ GET PENDING APPOINTMENT BY Instrcutor ID #################//
        let getAppointment = await appointmnetModel.getPendingApproval(i_id);
        if(getAppointment?.error)
        return  res.status(400).json(func.output(true,"Failed Getting all Appointment"));
        
        if(getAppointment?.data.length ===0)
        return res.status(200).json(func.output(false,"There is no pending approval appointment"));
        
        const appointment:any[]=getAppointment?.data;
        let data:any[] = []
        appointment.forEach(value=>{
            const setDate = value.schedule_date.toISOString().split('T')[0];
            let pending={
                    appointment_id :value.appointment_id,
                    amount:value.amount,
                    date:setDate,
                    day:value.available_day
            }
            data.push(pending);
        })
        

        return res.status(200).json(func.output(false,"Get Pending Appointment",data));



    }
    async function updateApprovalByInstructor(req:Request,res:Response){
        const {appointment_id,approval} = req.body;
        const {i_id} = (req as any).instructor;
     
        const getAppointment = await appointmnetModel.updateAppointmentApproval(i_id,appointment_id,approval);
        if(getAppointment?.error)
        return  res.status(400).json(func.output(true,"Failed Getting all Appointment"));

        //################ IF APPOINTMENT ID is WRONG (rowCount === 0) #################//
        if(getAppointment?.data === 0){
            return  res.status(400).json(func.output(true,"Please Enter Correct Appointment Id"));

        }
        return res.status(200).json(func.output(false,"Updated Approval Successfull"));
        
    }

//################ CRON JOBS #################//


    async function updateAppointmentStatus(){
        //################ UPDATING APPOINTMENT STATUS TO COMPLETED #################//
        const result = await appointmnetModel.updateAllAppointmentStatus();
        if(result?.error)return false;
    }
    
   async function updateAppointmentApproval(){
    //################ GETING NOT APPROVED APPOINTMENT AFTER MISSING CURRENT TIME (SCHDULE_TIME < CURRENT_TIME) #################//
    const getAppointment = await appointmnetModel.getNonApprovedAppointment();
    const appointment:any[] = getAppointment?.data;

    appointment.forEach(async value=>{
        //################ UPDATEING APPOINTMENT APPROVAL TO NOT APPROVED EVERY 5MINS #################//
        const updateAppointment = await appointmnetModel.updateAllAppointmentApproval(value.appointment_id);
    })
    
   }

export { router,
    updateAppointmentStatus,
    updateAppointmentApproval
}