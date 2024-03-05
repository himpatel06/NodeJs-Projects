const pool = require('../config/dbconnection');

const get_cart_byUId = async (uid)=>{
    try{
    const result = await pool.query(`select * from cart where u_id = $1`,[uid]);
    return result.rows;

}
    catch(err){
        console.log('e'+err);
    }
}
const insert_into_cart = async (cart_id)=>{
    try{
    const result = await pool.query(`insert into cart(u_id) values ($1) returning cart_id`,[cart_id]);
    return result.rows;
    
}
catch(err){
    console.log('e'+err);
}
}
const get_cart_item_products = async (product_id,cart_id)=>{
    try{
    const result =await pool.query(`select * from cart_item where product_id = $1 and cart_id = $2`,[product_id,cart_id]);
    return result.rows;
}
catch(err){
    console.log('e'+err);
}
}
const update_cart_quantity_price = async (qty,total_amt,product_id,cart_id)=>{
    try{
    const result = await pool.query(`update cart_item set quantity = $1,total_amt=$2 where product_id = $3 AND cart_id = $4`,[qty,total_amt,product_id,cart_id]); 

}
    catch(err){
        console.log('e'+err);
    }
}
const insert_into_cartItem = async (cart_id,product_id,qty,total_amt)=>{
    try{
    const result = await pool.query(`insert into cart_item(cart_id,product_id,quantity,total_amt) values($1,$2,$3,$4)`,
    [cart_id,product_id,qty,total_amt]);

    }
    catch(err){
        console.log('e'+err);
    }
}
const update_cart_amt = async (amt,cart_id)=>{
    try{
    const result = await pool.query(`UPDATE cart set total_amt = $1 where cart_id = $2`,[amt,cart_id]);

}
    catch(err){
        console.log('e-update-cart-'+err);
    }
}
const delete_cart_item_byCartID = async (cart_id,product_id)=>{
    try{
    const result = await pool.query(`delete from cart_item where cart_id = $1 AND product_id = $2`,[cart_id,product_id]);

    }
    catch(err){
        console.log('e'+err);
    }
}
const delete_cart_byCartId = async(cart_id)=>{
    try{
    const result = await pool.query('delete from cart where cart_id=$1',[cart_id]);

    }
    catch(err){
        console.log('e'+err);
    }
}



module.exports = {
    get_cart_byUId,
    insert_into_cart,
    get_cart_item_products,
    update_cart_quantity_price,
    insert_into_cartItem,
    update_cart_amt,
    delete_cart_item_byCartID,
    delete_cart_byCartId
}