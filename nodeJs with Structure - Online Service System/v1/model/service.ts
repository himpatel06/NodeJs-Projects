import appDb from "./appDb";
import * as schema from '../library/schema'

class Service extends appDb{
    constructor(){
        super();
        this.table = 'service';
        this.uniqueField = 'service_id'
    }

    async getServicesByInstructor(Instuctor_id:number){

            const column='service_id,service_name,service_desc,price'
            this.where='WHERE i_id ='+Instuctor_id
        
        const result = this.allRecords(column);
        return result;
    }
    async getServicesById(service_id:number){
      
           const column='service_id,service_name,service_desc,price'
            

        const result = this.selectRecord(service_id,column);
        return result;
    }

    async getSerivePrice(schedule_day_id:number){
    
            const column='price'
            this.where='WHERE schedule_day_id ='+schedule_day_id
            const table='schedule_day sd inner join service s on s.service_id = sd.service_id'
        
       // const result = await this.getAllRecords(data);
       const result = await this.jointSelect(table,column);
        return result;
    }

    async insertService(service_name:string,service_desc:string,price:number,i_id:number){
        const value = {
            service_name,
            service_desc,
            price,
            i_id
        }
        const result = this.insertRecord(value)
        return result;
    }
}




export default new Service;