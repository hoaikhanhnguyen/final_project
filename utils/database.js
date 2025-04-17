const mysql = require('mysql2')

//setting up database connection pool
const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 10,
  waitForConnections: true
});

module.exports = pool.promise();