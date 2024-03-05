const cartModel = require('../model/cart');
const productModel = require('../model/product');
const orderModel = require('../model/order');
const pool = require('../config/dbconnection')
const place_order = async (req,res)=>{
    const user_id = req.c_id;
    let order_id;

    const client = await pool.connect();
    //getting cart id
    const get_cart = await cartModel.get_cart_byUId(user_id);

        // check if product is there in the cart or not
        if(get_cart.length === 0) return res.status(400).json({error:true, message:"No Product In the cart", data:null})
        const cart = get_cart[0];


    //getting all the product details from product and cart_item table
        const products = await productModel.get_product_detail_byCartID(cart.cart_id);
        
        await client.query(`BEGIN`)
    //adding order details in the order table
           const get_order_id =await orderModel.insert_into_order(user_id,cart.total_amt,client);
            order_id = get_order_id[0].order_id;
        
    //putting values in order_item table
           products.forEach(async value=>{
            //checking available stock
            if(value.quantity <= value.product_qty){
            const new_quantity = value.product_qty-value.quantity;
            console.log(new_quantity);

            await orderModel.insert_into_order_item(
            order_id,user_id,value.product_id,value.total_amt,value.quantity,client);
            //updating stock in product table
            await productModel.updating_product_qty_byPId(new_quantity,value.product_id,client);
            }
            else{
               await client.query('ROLLBACK');
              //  await client.query('COMMIT');
                return res.status(400).json({error:true, message:value.product_name + " has insufficient stock", data:value})
            }
           })
   
        //clearing Cart
         //  await pool.query(cartModel.delete_cart_item_byCartID,[cart.cart_id]);
         //  await pool.query(cartModel.delete_cart_byCartId,[cart.cart_id]);
 

         await client.query('COMMIT');
    
             
           res.status(200).json({error:false, message:"Order Placed Successfully", data:null});

      

   
}

const view_all_orders = async (req,res) =>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    
    const user_id = req.c_id;
    const get_orders = await orderModel.get_order_with_address(user_id,page,limit);
    
    if(get_orders.length >0)
    return res.status(200).json({error:false, message:"View Order Details", data:get_orders});
    else
    res.status(400).json({error:true, message:"No order Places", data:null});
}

const view_order_byId = async (req,res)=>{
 
    const order_id = req.params.orderId;
    const get_order_detail = await orderModel.get_order_byOrderId(order_id);
    if(get_order_detail.error)
    res.status(400).json({error:true, message:"Invalid Order ID", data:null});

     else
    return res.status(200).json({error:false, message:"View Order Details by OrderId", data:get_order_detail});

}

module.exports = {place_order,view_all_orders,view_order_byId};