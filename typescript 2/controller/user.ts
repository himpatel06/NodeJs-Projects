import { Request,Response } from "express";
import * as schema from '../schema/schemas';
import * as userModel from '../models/users'
import bcrypt from 'bcrypt';
import * as validation from '../middleware/joi-validation'


const update_user=async (req:Request,res:Response)=>{
   const {fullname,email,password} = req.body;
   
    const u_id = (req as any).u_id;
    let user:schema.user = {
      u_id:u_id
    }
    
  if(password){
  const hashedPassword = await bcrypt.hash(password,10);
  user.password = hashedPassword;
    }
    if(email){
      const {error} = validation.emailValidation.validate(req.body);
      if(error)return res.status(400).json({error:true,message:error.details,data:null});

      user.email = email;
    }
    if(fullname){
      user.fulname = fullname;
    }

    const result = await userModel.updateUser(user);
    if(result.error)res.status(400).json({error:true,message:result.message,data:null});
    res.status(200).json({error:false,message:"User Updated Successfuly",data:null});

    }

const getUserById = async (req:Request,res:Response)=>{
  const u_id = (req as any).u_id;
  const user = await userModel.getUserById(u_id);
  if(user.error)return res.status(400).json({error:false,message:user.error,data:null});
  if(!user.data)return res.status(400).json({error:false,message:"User Don't exist",data:[]});
  res.status(200).json({error:false,message:"Getting user data",data:user.data[0]});

}
export{
    update_user,
    getUserById
}