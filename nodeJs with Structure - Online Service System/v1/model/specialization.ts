import appDb from "./appDb";

class Specialization extends appDb{

    constructor(){
        super()
        this.table = 'specialization'
        this.uniqueField='specialization_id'
    }
    async getSpecializationByProfession(profession_id:number){

       
        const table='specialization s inner join profession p on s.profession_id = p.profession_id'
          const column='*'
          this.where='where s.profession_id = '+profession_id

      
//  const result = this.getAllRecords(data);
    const result = this.jointSelect(table,column);
  return result
}

async insertSpecialization(profession_id:number,specialization_name:string){
 
  const result = await this.insertRecord({profession_id,specialization_name})
  return result;
}

async getSpecialization(specialization_name:string,profession_id:number){

  this.where = `where profession_id = ${profession_id} AND specialization_name ILIKE '${specialization_name}'`
  

 // const result = await this.getAllRecords(data);
 const result = await this.allRecords('specialization_id');
  return result;
}
}


export default new Specialization();