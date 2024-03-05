import pool from '../config/dbconnectio';


const get_cart_byUId = async (uid:number)=>{
    try{
    const result = await pool.query(`select * from cart where u_id = $1`,[uid]);
    
    if(!result)
    return {
        error:true,
        message:"Error in finding into cart",
        data:null
    }
    else{
        return{
            error:false,
            message:"get Cart details",
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

const insert_into_cart = async (u_id:number)=>{
    try{
    const result = await pool.query(`insert into cart(u_id) values ($1) returning cart_id`,[u_id]);
    return{
        error:false,
        message:"Inserted into the cart",
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

const insert_into_cartItem = async (cart_id:number,product_id:number,qty:number,total_amt:number)=>{
    try{
    const result = await pool.query(`insert into cart_item(cart_id,p_id,qty,total_amt) values($1,$2,$3,$4)`,
    [cart_id,product_id,qty,total_amt]);
    return{
        error:false,
        message:"Inserted into cart item",
        data:null
    }

    }
    catch(err){
        return{
            error:true,
            message:"Error: "+ err,
            data:null
        }
    }
}
const update_cart_amt = async (amt:number,cart_id:number)=>{
    try{
    const result = await pool.query(`UPDATE cart set total_amt = $1 where cart_id = $2`,[amt,cart_id]);
    return{
        error:false,
        message:"Updated Cart Amt successfully",
        data:null
    }
}
    catch(err){
        return{
            error:true,
            message:"Error: "+err,
            data:null
        }
    }
}
const get_cart_item_products = async (product_id:number,cart_id:number)=>{
    try{
    const result =await pool.query(`select * from cart_item where p_id = $1 and cart_id = $2`,[product_id,cart_id]);
    return{
        error:false,
        message:"get cart item products",
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
const update_cart_quantity_price = async (qty:number,total_amt:number,product_id:number,cart_id:number)=>{
    try{
       // console.log(qty,total_amt,product_id,cart_id);
    const result = await pool.query(`update cart_item set qty = $1,total_amt=$2 where p_id = $3 AND cart_id = $4`,[qty,total_amt,product_id,cart_id]); 
    return{
        error:false,
        message:"Updated Cart Quantity price",
        data:null
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

const delete_cart_item_byCartID = async (cart_id:number)=>{
    try{
    const result = await pool.query(`delete from cart_item where cart_id = $1`,[cart_id]);
    return{
        error:false,
        message:"Deleted from cart item",
        data:null
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
const delete_cart_byCartId = async(cart_id:number)=>{
    try{
    const result = await pool.query('delete from cart where cart_id=$1',[cart_id]);
    return{
        error:false,
        message:"deleted Cart",
        data:null
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
    get_cart_byUId,
    insert_into_cart,
    insert_into_cartItem,
    update_cart_amt,
    get_cart_item_products,
    update_cart_quantity_price,
    delete_cart_byCartId,
    delete_cart_item_byCartID
}