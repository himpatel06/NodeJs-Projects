import express,{ Request,Response } from "express";
import authenticate from "../middleware/jwt-authentication";
import * as validator from '../middleware/validator'
import scheduleModel from "../model/schedule";
import instructorModel from "../model/instructor";
import serviceModel from "../model/service";
import func from '../library/functions'


const router = express.Router();


router.get('/get-services/:instructor_id',validator.instructorValidator,authenticate('customer'),getServices);
router.post('/add-service',validator.addServiceValidator,authenticate('instructor'),addService)


async function getServices(req:Request,res:Response){
    const {instructor_id} = req.params;

    const result = await serviceModel.getServicesByInstructor(+instructor_id);
    if(result?.error) return res.status(400).json(func.output(true,"Unable to Extract Services"));

    if(result?.data.length === 0) return res.status(200).json(func.output(false,"Currently no Service Found"));
    return res.status(200).json(func.output(false,"Getting Services.",result?.data));
}

async function addService(req:Request,res:Response){
    const {service_name,service_desc,price} = req.body;
    const i_id = (req as any).instructor.i_id;

    const insertService = await serviceModel.insertService(service_name,service_desc,price,i_id);
    if(!insertService || insertService.error)
    return res.status(400).json(func.output(true,"Unable to Add Services"));


    const addScheduleDay = await scheduleModel.insertScheduleDay(insertService.data.service_id);
    if(!addScheduleDay) return res.status(400).json(func.output(true,"Unable to Add Schedules"));

    return res.status(200).json(func.output(true,"Service Added Successfully"));

}





export default router;