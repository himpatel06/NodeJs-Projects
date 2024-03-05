const pool = require('../config/dbconnection');

const insert_into_order = async (c_id,total_amt,client)=>{
    try{
    const result = await client.query(`insert into orders(c_id,status,total_amt,address_id) values($1,'Ready to Dispatch',$2,2) returning order_id;`,[c_id,total_amt]);
        return result.rows;
    }
    catch(err){
        console.log('e'+err);
    }
    
}
const insert_into_order_item = async(order_id,c_id,product_id,total_amt,qty,client)=>{
    try{
    const result = await client.query(`insert into order_item(order_id,c_id,product_id,total_amt,quantity) values($1,$2,$3,$4,$5)`,
    [order_id,c_id,product_id,total_amt,qty]);
     }
    catch(err){
        console.log('e'+err);
    }
}
const get_order_byOrderId = async (order_id)=>{
    try{

    const result = await pool.query(`select product_name,product_desc,product_price,quantity,total_amt from products p inner join order_item o ON p.product_id = o.product_id where order_id = $1;
    `,[order_id]);
    if(result.rows.length === 0){
        return {error:true,message:"Invalid OrderId"};
    }
    const order_detail = await pool.query(`select * from orders where order_id = $1`,[order_id]);
    result.rows.total_amt = order_detail.rows[0].total_amt;
    return result.rows;

     }
    catch(err){
        console.log('e'+err);
    }
}
const get_order_with_address = async (c_id,page,limit)=>{
    try{
       const offset = (page-1) * limit;
        const result = await pool.query('select order_id,status,total_amt,street,city,state from address a inner join orders o on a.address_id = o.address_id where o.c_id = $1 limit $2 offset $3 ',[c_id,limit,offset]);
        
        return result.rows;
        
    }
    catch(err){
        console.log('e'+err);
    }
}


module.exports = {
    insert_into_order,
    insert_into_order_item,
    get_order_byOrderId,
    get_order_with_address
}