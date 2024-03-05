import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import func from '../library/functions'

const authenticate = (entity:string) => {
    return (req:Request,res:Response,next:NextFunction)=>{
    const token = req.header('authentication');
    if(!token) return res.status(400).json(func.output(true,"Token Not Found"))
    try{
        const decode = jwt.verify(token,process.env.JWT_SIGN || '');
        
        if((decode as any)[entity])

        {
        
        (req as any)[entity] = (decode as any)[entity];
       
        next();
        }
        else return res.status(400).json(func.output(true,'Unauthorized User'));
        
    } 
    catch{
        return res.status(400).json(func.output(true,"Invalid Token"));
    }
}
}



export default authenticate;