const pool = require('../config/dbconnection')
const get_address_by_id =async (address_id) =>{
    const result = await pool.query('select * from address where address_id = $1',[address_id]);
    return result.rows;
}

module.exports={
    get_address_by_id
}