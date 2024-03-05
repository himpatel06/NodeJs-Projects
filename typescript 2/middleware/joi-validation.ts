import Joi from 'joi';
import { Request,Response ,NextFunction} from 'express';


const signupValidation = Joi.object({
    fullname:Joi.string().required().messages({"any.required":`Full name is requires`}),
    email: Joi.string().email().required().messages({"string.email":`Enter Proper email`}),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required()
    .messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
});

const loginValidation = Joi.object({
    email:Joi.string().required().email(),
    password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required()
})
const emailValidation = Joi.object({
    email:Joi.string().email(),
})

const cartValidation = Joi.object({
  product_id:Joi.number().required().min(0),
  product_qty:Joi.number().required().min(1)
})

const joiVlidation = (type:string)=>{ return (req:Request,res:Response,next:NextFunction)=>{
  let result:Joi.ValidationError | undefined;
  if(type ==='signup'){
    const {error} = signupValidation.validate(req.body,{
        abortEarly: false,
      });
    result = error;
    }

  else if(type ==='login'){
    const {error} = loginValidation.validate(req.body,{
      abortEarly: false,
    });
    result = error;
  }

  else if(type ==='email'){
    const {error} = emailValidation.validate(req.body);
    result = error;
  }
  else if(type ==='cart'){
    const {error} = cartValidation.validate(req.body);
    result = error;
  }

      if(result){
        const msg = result.details[0].message;
        return res.status(400).json({error:true,message:msg,data:null});
      }
    else{
        return next();
    }
}
}


export{
    
    emailValidation,
    joiVlidation,

}