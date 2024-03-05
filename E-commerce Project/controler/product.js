const pool = require('../config/dbconnection');
const product_model = require('../model/product')

const post_product =async (req,res)=>{
    const products = req.body;
   
    const data = [
        req.s_id,
        products.product_name,
        products.product_desc,
        products.product_price,
        products.product_qty
    ]
    console.log(data);
    await product_model.insert_into_product(data);
    res.status(200).json({'error':false,'message':'Product Added Successfully','data':null})
    
}
const get_products = async (req,res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    const products =await product_model.get_all_products(page,limit);
    console.log(products)
    res.status(200).json({'error':false,'message':'View all products','data':products});
}

const get_products_byId = async (req,res)=>{
    p_id = req.params.id;
    const product =await product_model.get_product_byid(p_id);
  
    res.status(200).json({'error':false,'message':'View all products','data':product});

}
module.exports = {post_product,get_products,get_products_byId};