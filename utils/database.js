const mysql = require('mysql2')

//setting up database connection pool
const pool = mysql.createPool({
  host: "ramon-s-garcia.tech",
  user: "ramonsga_host",
  password: "CST336project",
  database: "ramonsga_event_tracker",
  connectionLimit: 10,
  waitForConnections: true
});

module.exports = pool.promise();