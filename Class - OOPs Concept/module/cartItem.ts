import conn from '../config/dbConnection'

class CartItem extends conn{
    constructor(){
        super('cart_item');
    }

    async insert_into_cartItem(cart_id:number,product_id:number,qty:number,total_amt:number){
        try{
        // const result = await this.pool1.query(`insert into cart_item(cart_id,p_id,qty,total_amt) values($1,$2,$3,$4)`,
        // [cart_id,product_id,qty,total_amt]);

        const result = await this.insertValue(['cart_id','p_id','qty','total_amt'],[cart_id,product_id,qty,total_amt],'cart_item_id')
        return{
            error:false,
            message:"Inserted into cart item",
            data:null
        }
    
        }
        catch(err){
            return{
                error:true,
                message:"Error: "+ err,
                data:null
            }
        }
    }



    async get_cart_item_products(product_id:number,cart_id:number){
        try{
       // const result =await this.pool1.query(`select * from cart_item where p_id = $1 and cart_id = $2`,[product_id,cart_id]);
       const result = await this.getValueByCondition(['*'],`p_id = $1 and cart_id = $2`,[product_id,cart_id])
        return{
            error:false,
            message:"get cart item products",
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

    async update_cart_quantity_price(qty:number,total_amt:number,product_id:number,cart_id:number){
        try{
           // console.log(qty,total_amt,product_id,cart_id);
        //const result = await this.pool1.query(`update cart_item set qty = $1,total_amt=$2 where p_id = $3 AND cart_id = $4`,[qty,total_amt,product_id,cart_id]); 
        const result = await this.updateValue(['qty','total_amt'],'p_id = $3 AND cart_id = $4',[qty,total_amt,product_id,cart_id]);
        return{
            error:false,
            message:"Updated Cart Quantity price",
            data:null
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
    
    async delete_cart_item_byCartID(cart_id:number){
        try{
       // const result = await this.pool1.query(`delete from cart_item where cart_id = $1`,[cart_id]);
       const result = await this.deleteItem('cart_id=$',[cart_id]);
        return{
            error:false,
            message:"Deleted from cart item",
            data:null
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


export default new CartItem()