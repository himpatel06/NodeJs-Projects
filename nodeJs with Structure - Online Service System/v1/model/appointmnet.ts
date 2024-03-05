import appDb from "./appDb"
import * as schema from '../library/schema'




class Appointment extends appDb{
    constructor(){
        super();
        this.table = 'appointment';
        this.uniqueField = 'appointment_id';
    }

    async bookAppontment(schedule_day_id:number,schedule_time_id:number,instructor_id:number,amt:number,customer_id:number,app_date:string,transection:boolean = false){
        
        const data = {
            'c_id':customer_id,
            'schedule_day_id':schedule_day_id,
            'i_id':instructor_id,
            'schedule_time_id' :schedule_time_id,
            'amount':amt,
            'approval':'pending',
            'status':'upcomming',
            'schedule_date':app_date
        }
       // const result = this.insertRecord('appointment',data,transection);
       const result =await this.insertRecord(data,transection);
        return result;

    }

    async viewAllAppointment(c_id:number,page:number = 0,limit:number=0){
       
            const table=`Appointment a inner join schedule_day sd 
                    on a.schedule_day_id = sd.schedule_day_id 
                    inner join schedule_time st
                    on a.schedule_time_id = st.schedule_time_id`;
            const column=`appointment_id,amount,approval,schedule_date,available_day,start_time,end_time,a.status as appointment_status `
            this.where = 'WHERE true'
        
        console.log(page);
        //const result = this.getAllRecords(data,page,limit)
        const result = await this.jointSelect(table,column)
        return result
    }

    async getCompletedAppointment(){
    
       const column='appointment_id'
       const table=`appointment a inner join schedule_time st on a.schedule_time_id=st.schedule_time_id`
       this.where=`where schedule_date = CURRENT_DATE AND end_time < CURRENT_TIME AND a.status = 'upcomming'`
        
    //const result = this.getAllRecords(data)
    const result = await this.jointSelect(table,column);
    return result

    }

    async updateAppointStatus(appointment_id:number){
        const result = await this.updateRecord('appointment',{status:'completed'},'appointment_id = '+appointment_id)
    }

    async getAppointmentByIID(i_id:number){
        
           const column='appointment_id,amount,approval,a.status,schedule_date,available_day'
           this.where=`where a.i_id = ${i_id}`
            const table=`appointment a inner join schedule_day sd 
            ON a.schedule_day_id = sd.schedule_day_id
            inner join service s
            on sd.service_id = s.service_id`
        
      //  const result = await this.getAllRecords(data);
      const result = await this.jointSelect(table,column);
        return result;
    }

    async getAppointmentByIdandC_ID(appointment_id:number,c_id:number){
       
           const column='i.full_name,price,service_name,service_desc,profession_name,schedule_date,start_time,end_time'
            this.where=`WHERE a.appointment_id =${appointment_id} and c_id = ${c_id}`
            const table=`appointment a inner join schedule_day sd 
            ON a.schedule_day_id = sd.schedule_day_id
            inner join service s
            on sd.service_id = s.service_id
            inner join schedule_time st
            on a.schedule_time_id = st.schedule_time_id
            inner join instructor i
            on a.i_id = i.i_id
            inner join profession p
            on i.profession_id = p.profession_id`
        


     //   const result = await this.getAllRecords(data);
     const result = await this.jointSelect(table,column);
        return result
    }

    async getAppointmentByIdandI_ID(appointment_id:number,i_id:number){
    
           const column='c.full_name,price,a.approval,service_name,schedule_date,start_time,end_time'
            this.where = `WHERE a.appointment_id =${appointment_id} and a.i_id = ${i_id}`
            const table=`appointment a inner join schedule_day sd 
            ON a.schedule_day_id = sd.schedule_day_id
            inner join service s
            on sd.service_id = s.service_id
            inner join schedule_time st
            on a.schedule_time_id = st.schedule_time_id
            inner join instructor i
            on a.i_id = i.i_id
            inner join customers c
            on a.c_id = c.c_id`
        
       // const result = await this.getAllRecords(data);
       const result = await this.jointSelect(table,column);
        return result
    }

    async getPendingApproval(i_id:number){
       
           const table=`appointment a inner join schedule_day sd 
            ON a.schedule_day_id = sd.schedule_day_id
            inner join service s
            on sd.service_id = s.service_id
            inner join schedule_time st
            on a.schedule_time_id = st.schedule_time_id`
            const column=`appointment_id,amount,approval,a.status,schedule_date,available_day`
            this.where=`WHERE a.i_id = ${i_id} AND approval = 'pending'`
        
     //   const result = await this.getAllRecords(data);
     const result = await this.jointSelect(table,column);
        return result
    }

    async getNonApprovedAppointment(){
        
           const table=`appointment a inner join schedule_time st
            ON a.schedule_time_id = st.schedule_time_id`
           const column=`appointment_id`
            this.where=`WHERE start_time < CURRENT_TIME AND approval = 'not approved'`
        
       // const result = await this.getAllRecords(data);
       const result = await this.jointSelect(table,column);
        return result;
    }

    async updateAppointmentApproval(i_id:number,appointment_id:number,approval:boolean){
        let result
        if(approval){

         result = await this.updateRecord('appointment',{approval:'approved'},`i_id = ${i_id} and appointment_id = ${appointment_id}`)
        }
        else
        result = await this.updateRecord('appointment',{approval:'not approved'},`i_id = ${i_id} and appointment_id = ${appointment_id}`)

        return result;
    }

    async updateAllAppointmentApproval(appointment_id:number){
        const result = await this.updateRecord('appointment',{approval:'Canceled'},'appointment_id = '+appointment_id);
        return result;
    }

    async updateAllAppointmentStatus(){
        const result = this.updateRecord('appointment',{status:'completed'},`schedule_date < CURRENT_DATE`);
        return result;
    }

}

export default new Appointment