import { Request,Response } from "express";
import * as userModel from '../models/users'
import * as orderModel from '../models/order'
import * as cartModel from '../models/cart'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as schema from '../schema/schemas'


const signup = async (req:Request,res:Response) =>{
        const {email,password,fullname} = req.body;
        const result:schema.response = await userModel.getUserByEmail(email);
        if(result.error)return res.status(400).json({error:true,message:result.message,data:null});
        const user = result.data;
        if(user.length > 0){
            return res.status(400).json({error:true,message:'User already Exist',data:null});
        }
        const hashedPassword:string = await bcrypt.hash(password,10);
        const userInsert = await userModel.inserUser(email,hashedPassword,fullname);
        if(userInsert.error)
        return res.status(400).json({error:true,message:userInsert.message,data:null});
        const u1 = userInsert.data;

        if(!u1)return res.status(400).json({error:true,message:userInsert.message,data:null});

        const a = await cartModel.insert_into_cart(u1[0].u_id);
        if(!a.data)return res.status(400).json({error:true,message:a.message,data:null});
        const token = await jwt.sign(
        {'uid':u1[0].u_id , 
        'cart_id':a.data[0].cart_id,
        }
        ,'eVital',
        {expiresIn:'3h'});
        res.status(200).json({error:false,message:"Signup successfull",data:token});
      

}

const login = async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const result = await userModel.getUserByEmail(email);
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
export{
    signup,
    login
}