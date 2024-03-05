import conn from '../config/dbConnection';


class Product extends conn{
    constructor(){
        super('product');
    }

    async getAllProducts(page:number,limit:number){
        try{
            const offset = (page-1) * limit;
           // const result = await this.pool1.query(`select * from product limit $1 offset $2`,[limit,offset]);
            const result = await this.getValueByCondition(['*'],'true limit $1 offset $2',[limit,offset]);
            if(!result){
                return {
                    error:true,
                    message:"No product found",
                    data:null
                }
            }
            else{
                return {
                    error:false,
                    message:"View All the Products",
                    data:result.rows
                }
            }
        }
        catch(err){
            return{
                    error:true,
                    message:"error: "+err,
                    data:null
            }
        }
    }
    
    async getProductById(p_id:number){
        try{
           // const result = await this.pool1.query(`select * from product where p_id = $1`,[p_id]);
           const result = await this.getAllValueById('p_id',p_id);
            if(!result){
                return{
                    error:true,
                    message:"Product Not Found",
                    data:null
            }
            }
            return{
                error:false,
                message:"Get Product by Id",
                data:result.rows
        }
        }
        catch(err){
            return{
                error:true,
                message:"error: "+err,
                data:null
        }
        }
    }
    async get_product_detail_byCartID(cart_id:number){
        try{
    //     const result = await this.pool1.query(`select p.p_id,product_name,product_desc,qty,product_qty,total_amt from cart_item as c inner join product as p 
    // on c.p_id = p.p_id AND cart_id = $1;`,[cart_id]);
    const result = await this.getJoinData(['p.p_id','product_name','product_desc','qty','product_qty','total_amt'],'cart_id = $1','c.p_id = p.p_id',[cart_id],['cart_item as c','product as p'])
    return{
        error:false,
        message:"Get Product by Cart Id",
        data:result.rows
    }
    
        }
        catch(err){ 
            return{
                error:true,
                message:"error: "+err,
                data:null
        }
        }
    }
    
    async updating_product_qty_byPId(product_qty:number,product_id:number,client:any){
        try{
       // const result = await client.query(`update product set product_qty = $1 where p_id = $2`,[product_qty,product_id]);
       const result = await this.updateValue(['product_qty'],'p_id = $2',[product_qty,product_id],client);
        return{
            error:false,
            message:"Updating product qty",
            data:result.rows
        }
        }
        catch(err){
            return{
                error:true,
                message:"error: "+err,
                data:null
        }
        }
    }
    

}

export default new Product();