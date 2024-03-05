const conn = require('../config/connection');
conn.connect();
const getUser = (req,res)=>{
    conn.query(`select * from weather`,(err,result)=>{
        if(!err){
            res.send(result.rows);
        }

    })
}

const updateUser = (req,res)=>{
    const data = req.body;
    
    const query = `UPDATE weather set city = '${data.city}', temp_lo = ${data.temp_lo}, temp_hi = ${data.temp_hi}, prcp = ${data.prcp}, date='${data.date}' where city = '${data.city}';`;
    conn.query(query,(err,result)=>{
        if(!err)res.send('Updated successfully');
        else console.log(err);
    })
} 
const getUserById = (req,res)=>{
    const city = req.params.city;
    
    conn.query(`select * from weather where city = '${city}';`,(err,result)=>{
        if(!err){
            res.send(result.rows);
        }

    })
}

const postUser = (req,res)=>{
    const value = req.body;
    console.log(value);
    let insertQuery = `insert into weather values('${value.city}',${value.temp_lo},${value.temp_hi},${value.prcp},'${value.date}');`
    conn.query(insertQuery,(err,result)=>{
        if(!err)
        res.send("Data Add Successfully");
        else console.log(err);

    })
    
}

module.exports = {getUser,getUserById,postUser,updateUser};