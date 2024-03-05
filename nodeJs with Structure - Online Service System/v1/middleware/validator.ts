import {Request,Response,NextFunction} from 'express';
import Joi from 'joi'
import validation from '../library/validation'

function signupValidation(req:Request,res:Response,next:NextFunction){
    const signupSchema = Joi.object({
        email:Joi.string().trim().email().required().label('Please Enter Proper Email'),
        password:Joi.string().trim().required().regex(new RegExp(``)),
        fullname:Joi.string().required(),
        entity:Joi.string().trim().lowercase().valid('customer','instructor').label('Entity should be customer or Instructor').required()
    });

    const error = validation.validateRequest(req.body,res,next,signupSchema);
    if(error) return res.status(400).json(error); // validation failed

}

const loginValidation = (req:Request,res:Response,next:NextFunction)=>{
    const loginSchema = Joi.object({
        email:Joi.string().trim().email().required().label('Please Enter Proper Email'),
        password:Joi.string().trim().required().regex(new RegExp(``)),
        entity:Joi.string().trim().lowercase().valid('customer','instructor').label('Entity should be customer or Instructor').required()

    })

    const error = validation.validateRequest(req.body,res,next,loginSchema);
    if(error) return res.status(400).json(error);
}


const specializationValidation = (req:Request,res:Response,next:NextFunction)=>{

    const specializationSchema = Joi.object({
        specialization_id: Joi.number().min(1).label('please enter valid specialization id'),
        profession_id: Joi.number().required().min(1).label('please enter valid profession id'),
        page:Joi.number().min(1)
    });

    const error = validation.validateRequest(req.query,res,next,specializationSchema);
    if(error)return res.status(400).json(error);
}

const instructorValidator = (req:Request,res:Response,next:NextFunction)=>{

    const instructorSchema = Joi.object({
        instructor_id: Joi.number().required().min(1).label('please enter valid instructor id')
    });
    const error = validation.validateRequest(req.params,res,next,instructorSchema);
    if(error)return res.status(400).json(error);

}

const serviceValidation = (req:Request,res:Response,next:NextFunction)=>{
    const serviceSchema = Joi.object({
        service_id: Joi.number().required().min(1).label('Please Enter Valid Service Id'),
        date: Joi.date()
          .required()
          .min(new Date().toISOString().split('T')[0]) 
          .messages({
            'date.base': 'Please provide a valid date. in YYYY-MM-DD Format',
            'date.min': 'Date must not be before today.',
            'any.required': 'Date is required.',
          }),
    })
    const error = validation.validateRequest(req.body,res,next,serviceSchema);
    if(error) return res.status(400).json(error);
}
const scheduleValidation = (req:Request,res:Response,next:NextFunction) =>{
    const scheduleSchema = Joi.object({
        schedule_time_id:Joi.number().required().min(1).label('Please Enter Valid Schedule Id'),
        schedule_day_id:Joi.number().required().min(1).label('Please Enter Valid Schedule Id'),
        instructor_id:Joi.number().required().min(1).label('Please Enter Valid Schedule Id'),
        date: Joi.date()
        .required()
        .min(new Date().toISOString().split('T')[0]) 
        .messages({
          'date.base': 'Please provide a valid date. in YYYY-MM-DD Format',
          'date.min': 'Date must not be before today.',
          'any.required': 'Date is required.',
        }),
    })

    const error = validation.validateRequest(req.body,res,next,scheduleSchema);
    if(error) return res.status(400).json(error);
}

const professionValidator = (req:Request,res:Response,next:NextFunction)=>{
    const professionSchema = Joi.object({
        profession_id:Joi.number().min(1).label('Insert Valide Profession_Id'),
        profession_name:Joi.string().label('Insert Proper Profession Name')
    }).xor('profession_name', 'profession_id').required().label('Please Enter Either profession name or profession_id');

    const error = validation.validateRequest(req.body,res,next,professionSchema);
    if(error) return res.status(400).json(error);
}

const appointment_idValidator = (req:Request,res:Response,next:NextFunction)=>{
    const appointmentSchema = Joi.object({
        appointment_id:Joi.number().min(1).label('Insert Valide Profession_Id'),
    })
    const error = validation.validateRequest(req.body,res,next,appointmentSchema);
    if(error) return res.status(400).json(error);
}
const approvalValidator = (req:Request,res:Response,next:NextFunction)=>{
    const appointmentSchema = Joi.object({
        appointment_id:Joi.number().min(1).label('Insert Valide Profession_Id'),
        approval:Joi.boolean().label('It should be true Or False')
    })
    const error = validation.validateRequest(req.body,res,next,appointmentSchema);
    if(error) return res.status(400).json(error);
}

const addServiceValidator = (req:Request,res:Response,next:NextFunction) =>{
    const addServiceSchema = Joi.object({
        service_name:Joi.string().trim().required(),
        service_desc:Joi.string().required(),
        price:Joi.number().min(0).required()
    })
    const error = validation.validateRequest(req.body,res,next,addServiceSchema);
    if(error) return res.status(400).json(error);
}

const addSpecializationValidator = (req:Request,res:Response,next:NextFunction)=>{
    const addSpecializatioSchema = Joi.object({
        specialization_id:Joi.number().min(0).label('Please enter proper specialization Id'),
        profession_id:Joi.number().min(0).required().label('Please enter proper Profession Id'),
        specialization_name:Joi.string().trim().required().label('please enter proper specialization name')
    })
    const error = validation.validateRequest(req.body,res,next,addSpecializatioSchema);
    if(error) return res.status(400).json(error);
}


export{
    loginValidation,
    signupValidation,
    specializationValidation,
    instructorValidator,
    serviceValidation,
    scheduleValidation,
    professionValidator,
    appointment_idValidator,
    approvalValidator,
    addServiceValidator,
    addSpecializationValidator


}