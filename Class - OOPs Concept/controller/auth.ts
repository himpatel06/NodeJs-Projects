import { Request,Response } from "express";
import UserModel  from "../module/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



class Auth{
   
     public async signup(req:Request,res:Response){
        const {email,password,fullname} = req.body;
        const result = await UserModel.getUserByEmail(email);
        if(result.error)return res.status(400).json({error:true,message:result.message,data:null});


        const user = result.data;
        if(!user || user.length > 0){
            return res.status(400).json({error:true,message:'User already Exist',data:null});
        }


        const hashedPassword:string = await bcrypt.hash(password,10);
        const userInsert = await UserModel.inserUser(email,hashedPassword,fullname);


        if(userInsert.error)
        return res.status(400).json({error:true,message:userInsert.message,data:null});
    
        const userId = userInsert.data;
        if(!userId)return res.status(400).json({error:true,message:userInsert.message,data:null});
        
        const token = await jwt.sign(
        {'uid':userId[0].u_id}
        ,process.env.JWT_SECRET_KEY ||"",
        {expiresIn:'3h'});
        res.status(200).json({error:false,message:"Signup successfull",data:token});
      
    }

    public async login(req:Request,res:Response){
        const {email,password} = req.body;
        const result = await UserModel.getUserByEmail(email);
        if(result.error)
        return res.status(400).json({error:true,message:result.message,data:null});
        const user = result.data;
        if(!user || user.length === 0)return res.status(400).json({error:true,message:"User Don't Exist",data:null});
        const check = await bcrypt.compare(password,user[0].password);
        if(check){
            const token= await jwt.sign({'uid':user[0].u_id},'eVital',{expiresIn:'3h'});
            return res.status(200).json({error:false,message:"Login Successfull",data:token});
        }
        else{
            res.status(400).json({error:true,message:"Invalid Email or pasword",data:null});
        }
    }
}

export default new Auth;