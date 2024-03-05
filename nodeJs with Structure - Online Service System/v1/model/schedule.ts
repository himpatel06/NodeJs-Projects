import appDb from "./appDb"
import * as schema from '../library/schema'
import Connection from "../library/connection";


class Schedule extends appDb{
    constructor(){
        super();
        
    }

    async getScheduleDayByServiceId(service_id:number){
        
            this.table='schedule_day'
            const column='schedule_day_id,avaibility'
            this.where=`where service_id = ${service_id}`
        
      //  const result = this.getAllRecords(data);
      const result = this.allRecords(column);
        return result;
    }

    async getScheduleDayById(schedule_day_id:number){
        
            this.table='schedule_day'
            this.where = `where schedule_day_id= ${schedule_day_id}`
       // const result = await this.getRecordById(data);
        const result = await this.allRecords();
        return result
    }

    async getScheduleDayByServiceIdAndDay(service_id:number,day:string){
       
            this.table='schedule_day'
            const column='schedule_day_id,avaibility'
            this.where=`WHERE service_id = ${service_id} AND available_day = '${day}'`
        
       // const result = this.getAllRecords(data);
       const result = await this.allRecords(column);
        return result;
    }
    async getScheduleTimeById(schedule_time_id:number){
        // const data :schema.getRecordSchema= {
        //     table:'schedule_time',
        //     column:'*',
        //     condition:'schedule_time_id = '+schedule_time_id,
        // }
        // const result = this.getAllRecords(data);

      
            this.table='schedule_time'
            
            this.where = `WHERE schedule_time_id= ${schedule_time_id}`
                
        
       // const result = this.getRecordById(data);
       const result = this.allRecords();
        return result;
    }
    async getTodaySchedule(schedule_day_id:number){
    
            this.table='schedule_time'
            this.where = 'WHERE SCHEDULE_DAY_ID = '+schedule_day_id+' AND start_time > CURRENT_TIME AND avaibility=true'
        

     //   const result = await this.getAllRecords(data)
        const result = await this.allRecords();
        return result;
    }

    async getAnyDaySchedule(schedule_day_id:number){
   
           this.table='schedule_time';

            this.where='WHERE SCHEDULE_DAY_ID = '+schedule_day_id+' AND avaibility=true'
    

        const result = await this.allRecords()
        return result;
    }
    async updateScheduleStatus(schedule_time_id:number,status:string,transection:boolean = false){
        const data = {
            'status':status
        }
        const result = await this.updateRecord('schedule_time',data,'schedule_time_id = '+schedule_time_id,transection);
        return result;
    }
    async updateAllScheduleStatus(){
        const result =await this.updateRecord('schedule_time',{status:'Not Booked'}, 'true');
    }


    async insertScheduleDay(service_id:number){
        const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.table = 'schedule_day'
        for(let key in weeks){

            const result = await this.insertRecord({service_id:service_id,available_day:weeks[key],avaibility:'false'});
            if(result?.error){
                console.log('error')
                return false;
            }
          
        }
        return true; 
    }

    async updateScheduleDay(schedule_day_id:number,avaibility:boolean,transection:boolean = false){
        const condition =`schedule_day_id = ${schedule_day_id}`;
        const column = {
            'avaibility':avaibility
        }

        const result = await this.updateRecord('schedule_day',column,condition,transection);
        return result;
    }

    async insertScheduleTime(schedule_day_id:number,start_time:string,end_time:string,transection:boolean = false){
        const data = {
            schedule_day_id:schedule_day_id,
            avaibility:true,
            start_time:start_time,
            end_time:end_time,
            status:'Not Booked'
        }
        this.table = 'schedule_time';
        const result = await this.insertRecord(data,transection);
        return result;
    }

}


export default new Schedule