import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';

const userAuthentication = async(req:Request,res:Response,next:NextFunction) =>{
    const token = req.header('authentication');

    if(!token) return res.status(400).json({error:true,message:"Token Not Define",data:null});
    try 
    {
        const check = jwt.verify(token,'eVital');
        (req as any).u_id = (check as any).uid;
        (req as any).cart_id = (check as any).cart_id;
        return next();
        
    }
    catch{
        return res.status(400).json({error:true,message:"Invalid Token",data:null});
    }
    
}

export default userAuthentication;