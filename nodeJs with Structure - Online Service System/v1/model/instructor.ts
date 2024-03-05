import appDb from "./appDb"
import * as schema from '../library/schema'



class Instructor extends appDb{
    constructor(){
        super()
        this.table = 'instructor',
        this.uniqueField = 'i_id'
    }

    async getInstructorByProfession(prof_id:number,speci_id?:number,page:number = 0,limit:number = 0){
        let table,column;
      
        if(speci_id){
            this.where = `WHERE p.profession_id = ${prof_id} AND s.specialization_id = ${speci_id} `;
            table='instructor i inner join profession p on i.profession_id = p.profession_id inner join specialization s on i.specialization_id = s.specialization_id';
            column='i_id,full_name,profession_name,specialization_name'

            
        }
        else {
            this.where = `WHERE p.profession_id = ${prof_id}`;
            table = 'instructor i inner join profession p on i.profession_id = p.profession_id';
            column='i_id,full_name,profession_name'
        }
        
       // const result = this.getAllRecords(data,page,limit);
       const result = await this.jointSelect(table,column);
        return result;
    }

    async getInstructorByEmail(email:string){
        const data:{ table: string, value: any} = {
            table:'instructor',
            value:{
                'email':email
            }
        }
      //  const result = await this.getRecordById(data);
      this.where = `WHERE email = '${email}'`;
      const result = await this.allRecords();
        return result;
    }

    async insertInstructor(full_name:string,email:string,password:string){
      //  const result = await this.insertRecord('instructor',{full_name,email,password});
      const result = await this.insertRecord({full_name,email,password});
        return result; 
    }

    async updateIntructor(data:{},instructor_id:number){
        const result = await this.updateRecord('instructor',data,'i_id = '+instructor_id);
        return result;
    }
}


export default new Instructor()