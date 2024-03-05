import pool from '../config/dbconnectio';

const insert_into_order = async (c_id:number,total_amt:number,client:any)=>{
    try{
    const result = await client.query(`insert into orders(u_id,status,total_amt) values($1,'Ready to Dispatch',$2) returning order_id;`,[c_id,total_amt]);
        return {
            error:false,
            message:"Insert Into Orders",
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
const insert_into_order_item = async(order_id:number,product_id:number,total_amt:number,qty:number,client:any)=>{
    try{
    const result = await client.query(`insert into order_item(order_id,p_id,qty,total_amt) values($1,$2,$3,$4)`,
    [order_id,product_id,qty,total_amt]);

    if(result){
        return {
            error:false,
            message:"View All the Products",
            data:result.rows
        }
    }
    else{
        return {
            error:true,
            message:"Unable to insert order items",
            data:null
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
const get_order_byOrderId = async (order_id:number)=>{
    try{

    const result = await pool.query(`select product_name,product_desc,product_price,product_qty,total_amt from order_item o inner join product p ON o.p_id = p.p_id where order_id = $1;
    `,[order_id]);
    if(result.rows.length === 0){
        return {error:true,message:"Invalid OrderId",data:null};
    }
    const order_detail = await pool.query(`select * from orders where order_id = $1`,[order_id]);
    result.rows[0].total_amt = order_detail.rows[0].total_amt;
    
    return {
        error:false,
        message:"Get Order Details",
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
const get_all_order = async (u_id:number,page:number,limit:number)=>{
    try{
       const offset = (page-1) * limit;
       console.log(u_id);
        const result = await pool.query('select * from orders where u_id = $1 limit $2 offset $3',[u_id,limit,offset]);
        
        return {
            error:false,
            message:"get all orders",
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
    insert_into_order,
    insert_into_order_item,
    get_order_byOrderId,
    get_all_order
}