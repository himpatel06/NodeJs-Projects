import { Request,Response } from "express";
import * as productModel from '../models/product';
import * as schema from '../schema/schemas'

const viewAllProducts = async (req:Request,res:Response)=>{
    const page = req.query.page || 1;
    const limit = 4;
    const result =(await productModel.getAllProducts(+page,+limit));
    if(result.error){
        return res.status(400).json({error:true,message:result.message,data:null});
    }
    
     res.status(200).json({error:false,message:"get All Products",data:result.data});
}


const viewProductById = async (req:Request,res:Response)=>{
    const p_id = req.params.p_id;
    const result = await productModel.getProductById(+p_id);
    if(result.error)
    return res.status(400).json({error:true,message:result.message,data:null});
    if(!result.data || result.data.length ===0) 
    return res.status(400).json({error:true,message:"No product Found.",data:null});
    res.status(200).json({error:false,message:"get Product detail",data:result.data});


}
export{
    viewAllProducts,
    viewProductById
}