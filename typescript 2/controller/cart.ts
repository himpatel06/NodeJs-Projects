import { Request,Response } from "express";
import * as cartModel from '../models/cart';
import * as productModel from '../models/product';


const addToCart = async(req:Request,res:Response)=>{
    const u_id = (req as any).u_id;
    const {product_id,product_qty} = req.body;
    let cart_id;
    const result = await cartModel.get_cart_byUId(u_id);
    
    if(result.error || !result.data)
    return res.status(400).json({error:true,message:result.message,data:null});


    let get_cart;
        if(result.data.length === 0){ // value is not present in cart table
            get_cart = (await cartModel.insert_into_cart(u_id)).data;
            
            if(!get_cart)return res.status(400).json({error:true,message:"Cannot Insert Cart Item",data:null});

            get_cart[0].total_amt = 0;
        }
        else{ // value is present in cart table
            get_cart = result.data;
        }

    cart_id = get_cart[0].cart_id;

    const get_products =await productModel.getProductById(product_id);
    if(!get_products.data || get_products.data.length ===0 ) return res.status(400).json({error:true, message:"Product Not Found", data:null});
     
    //checking available stock
     const product =get_products.data[0];
     if(product.product_qty < product_qty){
         return res.status(400).json({error:true, message:"Insufficient Stock", data:null});
     }
     //if product already exist in cart------

     const existing_cart_item = (await cartModel.get_cart_item_products(product_id,cart_id)).data;

     if(existing_cart_item && existing_cart_item.length > 0){
         const existingProduct = existing_cart_item[0];
         existingProduct.qty +=product_qty;
         existingProduct.total_amt += (product.product_price*product_qty);

         const x = await cartModel.update_cart_quantity_price(existingProduct.qty,existingProduct.total_amt,product_id,cart_id);
          if(x.error) return res.status(400).json({error:true,message:x.message,data:null});               
     }
     // if it is not exist so create new cart item-------
     else{
          const y = await cartModel.insert_into_cartItem(
         cart_id,product_id,product_qty,product.product_price*product_qty);
         if(y.error) return res.status(400).json({error:true,message:y.message,data:null});
         }
     // updating cart total amount
         const new_amt = get_cart[0].total_amt + product.product_price*product_qty;
         console.log(product.product_price*product_qty);
         const a = await cartModel.update_cart_amt( new_amt,cart_id);
         if(a.error) return res.status(400).json({error:true,message:a.message,data:null});
         return res.status(200).json({error:false, message:"Product Added Successfully", data:null});

}

const view_cart = async (req:Request,res:Response)=>{
    const user_id = (req as any).u_id;
    const result = await cartModel.get_cart_byUId(user_id);
    try{
        if(result.error || !result.data) return res.status(400).json({error:true,message:result.message,data:null});
        if(result.data.length === 0) return res.status(400).json({error:true, message:"No product in the cart", data:null});
        const cart = result.data[0];
        const products = await productModel.get_product_detail_byCartID(cart.cart_id);
        if(products.error)return res.status(400).json({error:true,message:products.message,data:null});
        res.status(200).json({error:false, message:"View Products", data:products.data});
        
    } 
    catch(err){
       return res.status(400).json({error:true, message:err, data:null});
    }
}



export{
    addToCart,
    view_cart
}