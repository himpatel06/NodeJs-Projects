import pool from '../config/dbconnectio';


const getAllProducts = async (page:number,limit:number)=>{
    try{
        const offset = (page-1) * limit;
        const result = await pool.query(`select * from product limit $1 offset $2`,[limit,offset]);
        if(!result){
            return {
                error:true,
                message:"No product found",
                data:null
            }
        }
        else{
            return {
                error:false,
                message:"View All the Products",
                data:result.rows
            }
        }
    }
    catch(err){
        return{
                error:true,
                message:"error: "+err,
                data:null
        }
    }
}

const getProductById =async (p_id:number)=>{
    try{
        const result = await pool.query(`select * from product where p_id = $1`,[p_id]);
        if(!result){
            return{
                error:true,
                message:"Product Not Found",
                data:null
        }
        }
        return{
            error:false,
            message:"Get Product by Id",
            data:result.rows
    }
    }
    catch(err){
        return{
            error:true,
            message:"error: "+err,
            data:null
    }
    }
}
const get_product_detail_byCartID =async (cart_id:number)=>{
    try{
    const result = await pool.query(`select p.p_id,product_name,product_desc,qty,product_qty,total_amt from cart_item as c inner join product as p 
on c.p_id = p.p_id AND cart_id = $1;`,[cart_id]);
return{
    error:false,
    message:"Get Product by Cart Id",
    data:result.rows
}

    }
    catch(err){ 
        return{
            error:true,
            message:"error: "+err,
            data:null
    }
    }
}

const updating_product_qty_byPId =async (product_qty:number,product_id:number,client:any)=>{
    try{
    const result = await client.query(`update product set product_qty = $1 where p_id = $2`,[product_qty,product_id]);
    return{
        error:false,
        message:"Updating product qty",
        data:result.rows
    }
    }
    catch(err){
        return{
            error:true,
            message:"error: "+err,
            data:null
    }
    }
}

export{
    getAllProducts,
    getProductById,
    get_product_detail_byCartID,
    updating_product_qty_byPId
}