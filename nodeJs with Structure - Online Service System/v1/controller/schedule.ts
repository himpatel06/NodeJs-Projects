import express,{ Request,Response } from "express";
import * as schema from '../library/schema'
import serviceModel from "../model/service";
import instructorModel from "../model/instructor";
import authenticate from "../middleware/jwt-authentication";
import scheduleModel from "../model/schedule";
import * as validator from '../middleware/validator'
import func from '../library/functions'
import Connection from "../library/connection";

const router = express.Router();
    
router.get('/get-schedule',validator.serviceValidation,authenticate('customer'),getScheduleByService);
router.post('/update-schedule',authenticate('instructor'),updateAllScheduleStatus)



async function getScheduleByService(req:Request,res:Response) {
        const {service_id,date} = req.body;

        const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = new Date(date).getDay();
        const dayName = weeks[day];

    //############ Get Schedule_Day to check if Instructor is Available or not ###############//
    
        const getAvailbility = await scheduleModel.getScheduleDayByServiceIdAndDay(+service_id,dayName);
        if(getAvailbility?.error) return res.status(400).json(func.output(true,getAvailbility.message));

        if(!getAvailbility?.data[0].avaibility) return res.status(400).json(func.output(true,"Instructor Not Available on that Day"));
        
        let result;
    
    //############ If user entered todays Date ###############//
    
        if(date === new Date().toISOString().split('T')[0]){
            //############ get todays available schedule time slot after current time ###############//
             result = await scheduleModel.getTodaySchedule(getAvailbility?.data[0].schedule_day_id)
            
        }
        else{
            //############ if specialization name already exist ###############//
            result =  await scheduleModel.getAnyDaySchedule(getAvailbility?.data[0].schedule_day_id)
        }

     
        return res.status(200).json(func.output(false,"Get schedule",result?.data));
    }


async function updateAllScheduleStatus (req:Request,res:Response){
        const {service_id,days}=req.body;

    //########### CHECK IF PROPER SERVICE ID IS GIVEN OR NOT //###########
        const getService = await serviceModel.getServicesById(service_id);
        if(!getService || getService.error || getService.data.length ===0){
            return res.status(400).json(func.output(true,'Please enter proper service Id'));
        }
        
       
        
        await Connection.clientConn.query("BEGIN");

    //########### LOOP WILL STORE DATA IN SCHEDULE DAY AND SCHEDULE TIME TABLE //###########
        for(let key in days){   

            //########### CHECK IF INSTRUCTOR HAS ENTERED PROPER TIME, IT IS NOW OVERLAPING //###########
            if(days[key]){
            const checkOverLap = await func.istimeOverLap(days[key]);
            if(checkOverLap)
              { 
 
                await Connection.clientConn.query("ROLLBACK");
                return res.status(400).json(func.output(true,'Your Schedule is overlaping'));
             } 
            }
            //########### GETTINE SCHEDULE DAY ID //###########
            const getSchedule = await scheduleModel.getScheduleDayByServiceIdAndDay(service_id,key);
            const schedule_day_id = getSchedule?.data[0].schedule_day_id;
            let updateScheduleday;
                if(days[key]){ //If instructor is available at that day
                //########### UPDATING SCHEDULE DAY TABLE //###########
                 updateScheduleday = await scheduleModel.updateScheduleDay(schedule_day_id,true,true);

                //########### UPDATING SCHEDULE TIME TABLE //###########
                const timing:any[] = days[key];
                timing.forEach(async value=>{
                    const startTime = value.split(' - ')[0];
                    const endTime = value.split(' - ')[1];
                    const addTime = await scheduleModel.insertScheduleTime(schedule_day_id,startTime,endTime,true);
                    if(!addTime || addTime.error){
                        Connection.clientConn.query("ROLLBACK");
                        return res.status(400).json(func.output(true,'Unable to insert Schedule Time'));
                    }
                });
                }

                else{ // If instructor is not available at that day
                 updateScheduleday = await scheduleModel.updateScheduleDay(schedule_day_id,false,true);
                }

                if(updateScheduleday?.error) {
                    await Connection.clientConn.query("ROLLBACK");
                return res.status(400).json(func.output(true,'Unable to update Schedule'));
                }
                      

        }
        await Connection.clientConn.query("COMMIT");
        return res.status(200).json(func.output(false,'Schedule Update Successfully'));
 
    }


    const updateAllScheduleTimeStatus=async()=>{
        const result = await scheduleModel.updateAllScheduleStatus();
    }





export  {
    updateAllScheduleTimeStatus,
    router}