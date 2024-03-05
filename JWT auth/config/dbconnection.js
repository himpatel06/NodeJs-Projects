const Pool = require('pg').Pool;


const pool = new Pool({
    user:'postgres',
    host:'localhost',
    password:'123456798',
    database:'mydb',
    port:5432
});

module.exports=pool;