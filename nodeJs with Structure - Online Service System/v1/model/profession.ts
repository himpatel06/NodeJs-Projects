import appDb from "./appDb";
import * as schema from '../library/schema'


class Profession extends appDb{
    constructor(){
        super()
        this.table = 'profession'
        this.uniqueField = 'profession_id'
    } 

    async getAllProfession(){
       // const result = await this.getAllRecords(data);
    
       const result = await this.allRecords()
        return result;
    }

    async insertProfession(profession_name:string){
      
       // const result = await this.insertRecord('profession',{profession_name});
       const result = await this.insertRecord({profession_name});
        return result;
    }

    async getProfession(profession_id:number,profession_name:string){
        let condition='';
        if(profession_id){
            this.where=`WHERE profession_id = ${profession_id}`
        }
        else if(profession_name){
            this.where = `WHERE profession_name ILIKE '${profession_name}'`
        }
    
      //  const result = await this.getAllRecords(data);
      const result = await this.allRecords();
        return result;
    }
  

}



export default new Profession;