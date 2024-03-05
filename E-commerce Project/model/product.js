const pool = require('../config/dbconnection');

const get_product_byid = async (product_id)=>{
    try{
    const result =await pool.query(`select * from products where product_id = $1`,[product_id]);
    return result.rows;
    }
    catch(err){
        console.log('e'+err);
    }
} 
const get_product_detail_byCartID =async (cart_id)=>{
    try{
    const result = await pool.query(`select p.product_id,product_name,product_desc,quantity,product_qty,total_amt from products as p inner join cart_item as c 
on p.product_id = c.product_id AND cart_id = $1;`,[cart_id]);
        return result.rows;

    }
    catch(err){ 
        console.log('e'+err);
    }
}
const updating_product_qty_byPId =async (product_qty,product_id,client)=>{
    try{
    const result = await client.query(`update products set product_qty = $1 where product_id = $2`,[product_qty,product_id]);

    }
    catch(err){
        console.log('e'+err);
    }
}

const insert_into_product = async (data) =>{

    try{
   await pool.query(`insert into products(seller_id,product_name,product_desc,product_price,product_qty) values($1,$2,$3,$4,$5)`,
    data);
    }
    catch(err){
        console.log('e'+err);
    }
}

const get_all_products = async(page,limit)=>{
    try{
    const offset = (page-1) * limit;

    const result = await pool.query(`select * from products limit $1 offset $2`,[+limit,+offset]);

    const totalProduct = await pool.query(`select count(*) as count from products;`);
   // console.log(totalProduct.rows[0].count);
    const totalPage = Math.ceil(+totalProduct.rows[0].count/limit);
    result.rows.pagination = {
        'page':+page,
        'limit':+limit,
        'total-page':totalPage
    }
   // console.log(result.rows);
    return result.rows;
    }
    catch(err){
        console.log('e'+err);
    }
}
module.exports = {
    get_product_byid,
    get_product_detail_byCartID,
    updating_product_qty_byPId,
    insert_into_product,
    get_all_products
}