import * as orderModel from '../models/order'
import * as cartModel from '../models/cart'
import * as productModel from '../models/product'
import pool from '../config/dbconnectio'
import { Request,Response } from 'express'


const place_order = async (req:Request,res:Response)=>{
    const u_id = (req as any).u_id;
    let order_id:number;
    const client = await pool.connect();
    //getting cart id
    const get_cart = (await cartModel.get_cart_byUId(u_id)).data;

    // check if product is there in the cart or not
    if(!get_cart || get_cart.length === 0) return res.status(400).json({error:true, message:"No Product In the cart", data:null})
    const cart = get_cart[0];

//getting all the product details from product and cart_item table
    const products = await productModel.get_product_detail_byCartID(cart.cart_id);
    if(products.error || !products.data)
    return  res.status(400).json({error:true,message:products.message,data:null});

    await client.query(`BEGIN`)
//adding order details in the order table
       const get_order_id =await orderModel.insert_into_order(u_id,cart.total_amt,client);
       if(get_order_id.error ||!get_order_id.data)
       return res.status(400).json({error:true,message:get_order_id.message,data:null});
       order_id = get_order_id.data[0].order_id;
        console.log(products.data);
//putting values in order_item table
       products.data.forEach(async value=>{
        //checking available stock
        if(value.qty <= value.product_qty){
        const new_quantity = value.product_qty-value.qty;
        console.log(new_quantity);

        const a = await orderModel.insert_into_order_item(
        order_id,value.p_id,value.total_amt,value.qty,client);
        if(a.error)return res.status(400).json({error:true,message:a.message,data:null});
        //updating stock in product table
        const b = await productModel.updating_product_qty_byPId(new_quantity,value.product_id,client);
       
        if(b.error)return res.status(400).json({error:true,message:b.message,data:null});
        }
        else{
           await client.query('ROLLBACK');
          //  await client.query('COMMIT');
            return res.status(400).json({error:true, message:value.product_name + " has insufficient stock", data:value})
        }
       })

    //clearing Cart
    //await cartModel.delete_cart_item_byCartID(cart.cart_id)
    // await cartModel.delete_cart_byCartId(cart.cart_id);
      


     await client.query('COMMIT');
       res.status(200).json({error:false, message:"Order Placed Successfully", data:null});

}

const view_orders = async (req:Request,res:Response)=>{
 
    const u_id = (req as any).u_id;
    const page = req.query.page || 1;
    const limit = 4;
    const get_order_detail = await orderModel.get_all_order(u_id,+page,limit);
    if(get_order_detail.error)
    res.status(400).json({error:true, message:get_order_detail.message, data:null});

     else
    return res.status(200).json({error:false, message:"View Order Details by OrderId", data:get_order_detail.data});

}




export{
    place_order,
    view_orders
}