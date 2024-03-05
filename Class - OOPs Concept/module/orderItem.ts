import conn from '../config/dbConnection'


class OrderItem extends conn{
    constructor(){
        super('order_item');
    }
    async insert_into_order_item(order_id:number,product_id:number,total_amt:number,qty:number,client?:any){
        try{
          //  const result = await client.query(`insert into order_item(order_id,p_id,qty,total_amt) values($1,$2,$3,$4)`,
           // [order_id,product_id,qty,total_amt]);
            const result = await this.insertValue(['order_id','p_id','qty','total_amt'],[order_id,product_id,qty,total_amt],'order_item_id')
            if(result){
                return {
                    error:false,
                    message:"Insert In Order item successfull",
                    data:null
                }
            }
            else{
                return {
                    error:true,
                    message:"Unable to insert order items",
                    data:null
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



}

export default new OrderItem();