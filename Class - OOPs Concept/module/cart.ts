import conn from '../config/dbConnection';

class Cart extends conn{
    constructor(){
        super('cart');
    }

    async get_cart_byUId(uid:number){
        try{
       // const result = await this.pool1.query(`select * from cart where u_id = $1`,[uid]);
        const result = await this.getAllValueById('u_id',uid);
        if(!result)
        return {
            error:true,
            message:"Error in finding into cart",
            data:null
        }
        else{
            return{
                error:false,
                message:"get Cart details",
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
    
    async insert_into_cart(u_id:number){
        try{
       // const result = await this.pool1.query(`insert into cart(u_id) values ($1) returning cart_id`,[u_id]);
       const result = await this.insertValue(['u_id'],[u_id],'cart_id');

        return{
            error:false,
            message:"Inserted into the cart",
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
    
    
    async update_cart_amt(amt:number,cart_id:number){
        try{
       // const result = await this.pool1.query(`UPDATE cart set total_amt = $1 where cart_id = $2`,[amt,cart_id]);
       const result = await this.updateValue(['total_amt'],'cart_id = $2',[amt,cart_id]);
        return{
            error:false,
            message:"Updated Cart Amt successfully",
            data:null
        }
    }
        catch(err){
            return{
                error:true,
                message:"Error: "+err,
                data:null
            }
        }
    }
   
   
    async delete_cart_byCartId(cart_id:number){
        try{
        //const result = await this.pool1.query('delete from cart where cart_id=$1',[cart_id]);
        const result = await this.deleteItem('cart_id=$',[cart_id]);
        return{
            error:false,
            message:"deleted Cart",
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


export default new Cart();