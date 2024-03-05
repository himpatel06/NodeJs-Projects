const pool = require('../config/dbconnection')
const get_customer_byEmail = async (email)=>{
    try{
    const get_customer = await pool.query(`select * from customers where email = $1`,[email]);
    return get_customer.rows;
}
    catch(err){
        console.log('e'+err);
    }

}

const insert_into_customer = async (user)=>{
    await pool.query(`insert into customers (name,email,password) values($1,$2,$3)`,
        [user.name,user.email,hashedPassword]);
}


module.exports = {
    get_customer_byEmail,
    insert_into_customer
}