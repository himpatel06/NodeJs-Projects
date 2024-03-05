const pool = require('../config/dbconnection');
const productModel = require('../model/product');
const cartModel = require('../model/cart');

const add_to_cart = async (req,res)=>{

    const user_id = req.c_id;
    const {product_id,product_qty} = req.body;

    let cart_id;

    //check if there is any value in cart table
    const result = await cartModel.get_cart_byUId(user_id);
    try{
        let get_cart;
        if(result.length === 0){ // value is not present in cart table
            get_cart = await cartModel.insert_into_cart(user_id); 
            get_cart[0].total_amt = 0;
        }
        else{ // value is present in cart table
            get_cart = result;
        }

        cart_id = get_cart[0].cart_id;

        
        //geting product details from product table
        const get_products =await  productModel.get_product_byid(product_id);
        if(get_products.length ===0 ) return res.status(400).json({error:true, message:"Product Not Found", data:null});

        //checking available stock
        const product =get_products[0];
        if(product.product_qty < product_qty){
            return res.status(400).json({error:true, message:"Insufficient Stock", data:null});
        }
        new_qty = product.product_qty - product_qty;
        //if product already exist in cart------

        const existing_cart_item = await cartModel.get_cart_item_products(product_id,cart_id);

        if(existing_cart_item.length > 0){
            const existingProduct = existing_cart_item[0];
            existingProduct.quantity +=product_qty;
            existingProduct.total_amt += (product.product_price*product_qty);

            await cartModel.update_cart_quantity_price(existingProduct.quantity,existingProduct.total_amt,product_id,cart_id);
                            
        }
        // if it is not exist so create new cart item-------
        else{
             await cartModel.insert_into_cartItem(
            cart_id,product_id,product_qty,product.product_price*product_qty);
            }
        // updating cart total amount
            const new_amt = get_cart[0].total_amt + product.product_price*product_qty;
            console.log(product.product_price*product_qty);
            await cartModel.update_cart_amt( new_amt,cart_id);
      
            return res.status(200).json({error:false, message:"Product Added Successfully", data:null});
                  
    }
    catch(err){
        return res.status(400).json({error:true, message:err, data:null});
    }
}


const view_cart = async (req,res)=>{
    const user_id = req.c_id;
    const result = await cartModel.get_cart_byUId(user_id);
    try{
        if(result.length === 0) return res.status(400).json({error:true, message:"No product in the cart", data:null});
        const cart = result[0];
        const products = await productModel.get_product_detail_byCartID(cart.cart_id);
        res.status(200).json({error:false, message:"View Products", data:products});
        
    } 
    catch(err){
       return res.status(400).json({error:true, message:err, data:null});
    }
}

const remove_product = async (req,res)=>{
    const {product_id} = req.body;
    const user_id = req.c_id;
    const result = cartModel.get_cart_byUId(user_id);

    try{
        if(err)return res.status(400).json({error:true, message:err, data:null});
        const cart_id = result[0].cart_id;
        await cartModel.delete_cart_item_byCartID(cart_id,product_id);
        res.status(200).json({error:false, message:"product deleted successfully", data:null});
 
    }
    catch(err){
       return res.status(400).json({error:true, message:err, data:null});
    }

}

module.exports = {add_to_cart,view_cart,remove_product};