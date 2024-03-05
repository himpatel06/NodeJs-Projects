import conn from '../config/dbConnection';

class Order extends conn{
    constructor(){
        super('orders');
    }

    async insert_into_order(c_id:number,total_amt:number,client:any){
        try{
           // const result = await client.query(`insert into orders(u_id,status,total_amt) values($1,'Ready to Dispatch',$2) returning order_id;`,[c_id,total_amt]);
            const result = await this.insertValue(['u_id','status','total_amt'],[c_id,'Ready to Dispatch',total_amt],'order_id');
                return {
                    error:false,
                    message:"Insert Into Orders",
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


    async get_order_byOrderId(order_id:number){
        try{
            // const result = await this.pool1.query(`select product_name,product_desc,product_price,qty,total_amt from order_item o inner join product p ON o.p_id = p.p_id where order_id = $1;
            // `,[order_id]);
            const result = await this.getJoinData(['product_name','product_desc','product_price','qty','total_amt'],'order_id = $1','o.p_id = p.p_id',[order_id],['order_item o','product p']);
            if(result.rows.length === 0){
                return {error:true,message:"Invalid OrderId",data:null};
            }
           // const order_detail = await this.pool1.query(`select * from orders where order_id = $1`,[order_id]);
           const order_detail = await this.getAllValueById('order_id',order_id);
            result.rows.push({'total_order_amt': order_detail.rows[0].total_amt,'total_qty':result.rows.length});
            
            return {
                error:false,
                message:"Get Order Details",
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

    async get_all_order(u_id:number,page:number,limit:number){
        try{
            const offset = (page-1) * limit;
            // const result = await this.pool1.query('select o.*,count(oi.order_id) as total_item from orders o JOIN order_item oi ON o.order_id = oi.order_id where o.u_id = $1 group by o.order_id limit $2 offset $3',[u_id,limit,offset]);
            const result = await this.getJoinData(['o.*','count(oi.order_id) as total_item'],`o.u_id = $1 group by o.order_id limit $2 offset $3`,'o.order_id = oi.order_id',[u_id,limit,offset],['orders o','order_item oi'])
             return {
                 error:false,
                 message:"get all orders",
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


export default new Order();