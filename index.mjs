import express from 'express';
import mysql from 'mysql2/promise';
import session from "express-session";
import loginRoutes from "./routes/login.js";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//session settings
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//setting up database connection pool
// const pool = mysql.createPool({
//   host: "",
//   user: "",
//   password: "",
//   database: "",
//   connectionLimit: 10,
//   waitForConnections: true
// });
// const conn = await pool.getConnection();

//routes
app.use(loginRoutes);

app.get('/', (req, res) => {
  res.render('login', {});
});

app.get("/dbTest", async(req, res) => {
  let sql = "SELECT CURDATE()";
  const [rows] = await conn.query(sql);
  res.send(rows);
});//dbTest

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>')
});//404

app.listen(3000, ()=>{
  console.log("Express server running on port: " + 3000);
})

