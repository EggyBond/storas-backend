const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'storas_backend',
  password: 'root',
  port: 5432,
})