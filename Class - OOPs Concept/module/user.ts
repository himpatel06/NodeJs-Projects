import conn from "../config/dbConnection";


class User extends conn{
    constructor(){
        super('users');
    }
    
    async getUserByEmail(email:string){
        try{
          const result = await this.getAllValueById('email',email);
           return {
            error:false,
            message:"get user data successfull",
            data:result.rows
            }
        }
        catch(err){
                return{
                    error:true,
                    message:"error "+err,
                    data:null
                }      
        }
    }

    async inserUser(email:string,password:string,fullname:string){
       try{
        const result = await this.insertValue(['email','password','fullname'],[email,password,fullname],'u_id')
        if (!result) {
            return {
                error:true,
                message:"",
                data:null
            }
        }
        else{
            return{
                error:false,
                message:"Data inserted successfully",
                data:result.rows
            }
        }
    }
    catch(err){
        return {
                   error:true,
                   message:"error"+err,
                   data:null
        }
       }
    }

    async updateUser(user:any){
        try{
            if(user.email)
            await this.updateValue(['email'],`u_id = $2`,[user.email,user.u_id])
            if(user.fulname)
            await this.updateValue(['fullname'],`u_id = $2`,[user.fullname,user.u_id])
            if(user.password)
           await this.updateValue(['password'],`u_id = $2`,[user.password,user.u_id])

    
            return {
                error:false,
                message:"Data updated successfully",
                data:null
            }
        }
        catch(err){
            return{
                error:true,
                message:"error:"+err,
                data:null
            }
        }

    }

    async getUserById(u_id:number){
        try {
        const user = await this.getAllValueById('email',u_id);
        if(user)
        return{
            error:false,
            message:"get user by id",
            data:user.rows}
        else{
            return {
                error:true,
                message:"Cannot get the data",
                data:null
            }
        }
    }
    catch(err){
        return{
                error:true,
                message:"error:" + err,
                data:null
        }
    }
    }

}


export default new User();
