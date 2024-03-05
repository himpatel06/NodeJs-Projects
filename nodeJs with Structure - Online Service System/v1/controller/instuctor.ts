import express,{ Request,Response } from "express";
import authenticate from "../middleware/jwt-authentication";
import instructorModel from "../model/instructor";
import func from '../library/functions'
import * as validator from '../middleware/validator'


const router = express.Router();

//Customer Routers
router.get('/get-instructor',validator.specializationValidation,authenticate('customer'),getInstructor);


async function getInstructor(req:Request,res:Response){

    const {profession_id,specialization_id} = req.query;

    const temp = Number(req.query.page);
    const page = (isNaN(temp) || temp <=0) ? 1:temp;
    const limit = 5;

    const result= await instructorModel.getInstructorByProfession(Number(profession_id),Number(specialization_id),page,limit);
    if(result?.error) return res.status(400).json(func.output(true,"Unable to Extract Instuctor"));

    if(result?.data.length === 0) return res.status(200).json(func.output(false,"Currently no instructor Found"));
    return  res.status(200).json(func.output(false,"Get All Instructor",result?.data));
}



export default router;