import express,{ Request,Response } from "express";
import authenticate from "../middleware/jwt-authentication";
import professionModel from "../model/profession";
import instructorModel from "../model/instructor";
import func from '../library/functions'
import specializationModel from "../model/specialization";
import * as validator from '../middleware/validator'

const router = express.Router();

router.get('/view-profession',authenticate('customer'),viewProfession);
router.get('/view-specialization',authenticate('customer'),viewSpecialization);
router.post('/add-profession',validator.professionValidator,authenticate('instructor'),addProfession);
router.post('/add-specialization',validator.addSpecializationValidator,authenticate('instructor'),addSpecialization)




async function viewProfession(req:Request,res:Response){
    const result = await professionModel.getAllProfession();
    if(result?.error)
        return res.status(400).json(func.output(true,"Unable to Extract Professions"));
    return res.status(200).json(func.output(false,"Get All Prfessions",result?.data));

}

async function addProfession(req:Request,res:Response){
    //instructor either enter profession Id or Profession Name
    const {profession_id,profession_name} = req.body;
    const i_id = (req as any).instructor.i_id;


    let name=undefined;
    let proff_id=undefined;
    //if profession_name is given by instructor
    if(profession_name){
        name = profession_name.toLowerCase().trim();
    }

    //if profession_id is given by instructor
    if(profession_id){
        proff_id = profession_id
    }
   
    //check if the profession id or profession name is present in the profession table
    const result = await professionModel.getProfession(proff_id,name);
    
    if(result?.error)
    return res.status(400).json(func.output(true,"Unable to Extract Professions"));
 
    //If Profession id is invalid
    if(proff_id && result?.data.length ===0)
    return res.status(400).json(func.output(true,"Pleas Enter proper profession Id"));

    //if profession already exist
    let id:number;
    if(result?.data.length > 0){
        id = result?.data[0].profession_id;
    }

    //if profession don't exist
    else{
        const insertProfession = await professionModel.insertProfession(profession_name);
        if(insertProfession?.error || !insertProfession?.data)
        return res.status(400).json(func.output(true,"Unable to Insert Professions"));

        id = insertProfession?.data.profession_id;
    }

    //updating profession_id in instructor
    const updateInstructor = await instructorModel.updateIntructor({profession_id:id},i_id);
    return res.status(200).json(func.output(false,"Updated Profession Successfully"));

}

async function viewSpecialization(req:Request,res:Response){
    const profession_id = req.body.profession_id
    const result = await specializationModel.getSpecializationByProfession(profession_id);
    if(result?.error) return res.status(400).json(func.output(true,"Unable to Extract Specialization"));

    return res.status(200).json(func.output(false,"Get All Specialization",result?.data));
}

async function addSpecialization(req:Request,res:Response){
    //############ User will either enter Specialization_id  or  profession_id and specialization name  ###############//
    let {specialization_id,profession_id,specialization_name} = req.body;
    const i_id = (req as any).instructor.i_id;

    specialization_name = String(specialization_name).trim();

    //############ if specialization_id is given ###############//
    if(specialization_id){
        const updateinstructor = await instructorModel.updateIntructor({specialization_id},i_id);
        if(!updateinstructor || updateinstructor?.error) return res.status(400).json(func.output(true,"Error updating Instructor"));
    }
    //############ if profession_id and specialization name is given ###############//
    else{
        let s_id:number;
        const getProfession = await professionModel.getProfession(profession_id,'');
        if(!getProfession || getProfession.error || getProfession.data.length ===0)
        return res.status(400).json(func.output(true,"Enter correct profession id"));
        
        const getSpcialization = await specializationModel.getSpecialization(specialization_name,profession_id);
    
    //############ if specialization name already exist ###############//
        if(getSpcialization?.data.length >0){
            s_id = getSpcialization?.data[0].specialization_id;
        }

    //############ Add new specialization in the table ###############//
        else{
        const insertSpecialization = await specializationModel.insertSpecialization(profession_id,specialization_name);
        if(insertSpecialization?.error)return res.status(400).json(func.output(true,"Error insert specialization"));
         s_id = insertSpecialization?.data.specialization_id
        }
        const updateInstructor = await instructorModel.updateIntructor({specialization_id:s_id},i_id)
        if(updateInstructor?.error) return res.status(400).json(func.output(true,"Unable to update instructor"));
        return res.status(200).json(func.output(true,"Specialization Added successfully"));
    
    }
}


export default router;