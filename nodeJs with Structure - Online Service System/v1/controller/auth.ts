import express,{Request,Response,NextFunction} from 'express';
import func from '../library/functions'
import * as validator from '../middleware/validator'
import customerModel from '../model/customer'
import instructorModel from '../model/instructor';
import bcrypt from 'bcrypt'
import authenticate from '../middleware/jwt-authentication';
import jwt from 'jsonwebtoken'
import scheduleModel from '../model/schedule';

const router = express();

router.post('/signup',validator.signupValidation,signup);
router.post('/login',validator.loginValidation,login);
router.get('/signout',authenticate('customer'),(req:Request,res:Response)=>{res.send('In signOut')})


async function signup (req:Request,res:Response){
    const {fullname,email,password} = req.body;
    let {entity} = req.body;
    entity = entity.toLowerCase().trim();
    //############ check if user already exist in the table or not by Email ###############//
    let result;
    let token;
    if(entity === 'customer'){
        result = await customerModel.getCustomerByEmail(email);
    }
    else{
        result = await  instructorModel.getInstructorByEmail(email)
    }
    if(!result) return res.status(400).json(func.output(false,'login Failed'));
    if(result.error) return res.status(400).json(result);

    if(result.data.length > 0) return res.status(400).json(func.output(true,"User Already Exist"));

    //then encrypt the password
    const hashed_pass = await bcrypt.hash(password,10);

    //store it in database
    if(entity === 'customer'){ 
    const insertValue = await customerModel.insertCustomer(fullname,email,hashed_pass);
    if(insertValue?.error)return res.status(400).json(func.output(true,"Error in inserting value"));
    const user = insertValue?.data;
    //create JWT token of the User
     token = jwt.sign(
        {customer:{
            c_id:user.c_id,
            customer_name:user.full_name,
            customer_email:user.email
        }},
        process.env.JWT_SIGN || '',
        {expiresIn:'2hr'});
    }
    else{
        const insertValue = await instructorModel.insertInstructor(fullname,email,hashed_pass);
        if(insertValue?.error)return res.status(400).json(func.output(true,"Error in inserting value"));
        const user = insertValue?.data;
    //create JWT token of the User
        token = jwt.sign(
            {instructor:{
                i_id:user.i_id,
                instructor_name:user.full_name,
                instructor_email:user.email
            }},
            process.env.JWT_SIGN || '',
            {expiresIn:'2hr'});
        }
    res.status(200).json(func.output(false,"Signup Successfull",token));
}



async function login(req:Request,res:Response){

    let {email,password,entity} = req.body;
    entity = entity.toLowerCase().trim();

    let token,result;
    if(entity === 'customer'){
        result =await customerModel.getCustomerByEmail(email);
        
    }
    else{
        result =await instructorModel.getInstructorByEmail(email);
    }
    if(!result) return res.status(400).json(func.output(true,'login Failed'));
    if(result.error) return res.status(400).json(result);

    if(result.data.length === 0) return res.status(400).json(func.output(true,'User Dont Exist'));
    const user = result.data[0];

    const check =await bcrypt.compare(password,user.password);
    if(check){
        if(entity === 'customer'){
            token = jwt.sign(
                {
                customer:{
                    c_id:user.c_id,
                    customer_name:user.full_name,
                    customer_email:user.email
                }
                },
                process.env.JWT_SIGN || '',
                { expiresIn:'8hr'})
        }

        else{
            token = jwt.sign(
                {instructor:{
                    i_id:user.i_id,
                    instructor_name:user.full_name,
                    instructor_email:user.email
                }},
                process.env.JWT_SIGN || '',
                {expiresIn:'8hr'});
            
            }
    }
    else{
        return res.status(400).json(func.output(true,'incorrect email or password'));
    }

    res.status(200).json(func.output(false,"Login in Successfull",token));

}




export default router;