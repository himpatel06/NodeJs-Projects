import appDb from './appDb'


class User extends appDb{ 
    constructor(){
        super()
        this.table = 'customers',
        this.uniqueField = 'c_id'
    }

    async getCustomerByEmail(email:string){
      
      //  const result = await this.getRecordById(data);
      this.where = `WHERE email = '${email}'`;
      const result = await this.allRecords()
        return result;
    }

    async insertCustomer(full_name:string,email:string,password:string){
     //   const result = await this.insertRecord('customers',{full_name,email,password});
        const result = await this.insertRecord({full_name,email,password});
        return result;
    }
}


export default new User;