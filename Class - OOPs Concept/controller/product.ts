import { Request,Response } from "express";
import productModel from "../module/product";


class Product{
    async viewAllProducts(req:Request,res:Response){
        const temp = Number(req.query.page);
        const page = (isNaN(temp) || temp <=0) ? 1:temp;
        const limit = 4;
        const result =(await productModel.getAllProducts(+page,+limit));
        if(result.error){
            return res.status(400).json({error:true,message:result.message,data:null});
        }
        
         res.status(200).json({error:false,message:"get All Products",data:result.data});
    }
    
    
    async viewProductById(req:Request,res:Response){
        const p_id = req.params.p_id;
        const result = await productModel.getProductById(+p_id);
        if(result.error)
        return res.status(400).json({error:true,message:result.message,data:null});
        if(!result.data || result.data.length ===0) 
        return res.status(400).json({error:true,message:"No product Found.",data:null});
        res.status(200).json({error:false,message:"get Product detail",data:result.data});
    
    }

}



export default new Product();