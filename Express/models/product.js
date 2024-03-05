const fs = require('fs');
const path = require('path');

const p = path.join(__dirname,'..','data','products.json');
const getProductFromFile = data =>{
    fs.readFile(p,(err,fileContent)=>{
        if(!err){
            const product = JSON.parse(fileContent);
            data(product);
        }
        else{
            data([]);
        }
    })
}
class Product {
    constructor(id,title,imageUrl,desc,price){
        this.id = id
        this.title =  title;
        this.imageUrl = imageUrl;
        this.desc = desc;
        this.price = price;
        this.id = Math.random().toString();
    }
 
    

    save(){ 
        if(this.id){
            getProductFromFile((product)=>{
                const index = product.findIndex(prod => prod.id === this.id);
                product[index] = this;
                fs.writeFile(p,JSON.stringify(product),err=>{
                    console.log("Error");
                });
            })
        }
        else{
            this.id = Math.random();
        }
        fs.readFile(p,(err,fileContent)=>{
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }
            
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err);
            })
        });
    } 

    static fetchAll(cb){
        fs.readFile(p,(err,fileContent)=>{
            if(err) return cb([]);
            return cb(JSON.parse(fileContent));
        });
    }

    static findById(productId,cd){
        
        fs.readFile(p,(err,fileContent)=>{
            const data = JSON.parse(fileContent);
            
            const product = data.find(product => product.id ===productId);
            
            cd(product);
        });
    }
}



module.exports = Product;