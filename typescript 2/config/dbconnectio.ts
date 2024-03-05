import {Pool} from 'pg';

 const pool = new Pool({
    user:'postgres',
    password:'123456798',
    host:'localhost',
    database:'typescriptdb',
    port:5432
})

export default pool;