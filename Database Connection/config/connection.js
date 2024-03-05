const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: '123456798',
  port: 5432,
});

module.exports = pool;