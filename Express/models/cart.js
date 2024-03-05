const fs = require('fs');
const path = require('path');

const p = path.join(__dirname,'..','data','cart.json');
class Cart{
    static addToCart(pid,productPrice){
        let cart = {
            product:[],
            Totalprice: 0
        }
        
        fs.readFile(p,(err,fileContent)=>{
            if(!err){ 
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.product.findIndex(p => p.id ===pid);
            const existingProduct = cart.product[existingProductIndex];

            console.log(existingProduct);
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.quantity +=updatedProduct.quantity;
                cart.product[existingProductIndex].quantity = updatedProduct.quantity;
            }
            else{
                updatedProduct = {id:pid,quantity:1};
                cart.product = [...cart.product,updatedProduct];
            }
            cart.Totalprice =cart.Totalprice + +productPrice;

            fs.writeFile(p,JSON.stringify(cart),(err)=>{
              //  console.log(err);
            })
        
        });
    }
}

module.exports = Cart;