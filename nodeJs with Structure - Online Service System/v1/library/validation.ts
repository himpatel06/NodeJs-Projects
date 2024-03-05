import { Request,Response,NextFunction } from "express";
import func from './functions'

class Validation{

    validateRequest(data:any,res:Response,next:NextFunction,schema:any){
        const {error,value} = schema.validate(data,{abortEarly:true});
        if(error)
        return func.output(true,error.message);
        else next();
    }
}

export default new Validation;