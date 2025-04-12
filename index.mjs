import express from 'express';
import mysql from 'mysql2/promise';
import session from "express-session";
import loginRoutes from "./routes/login.js";
import flash from "connect-flash";

import loginController from "./controllers/login.js";
import errorController from "./controllers/error.js";

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

//initialize flash messages
app.use(flash());

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

//middleware
app.use((req,res,next)=>{
  res.locals.isLoggedIn = req.session.authenticated;
  res.locals.path = req.path;
  next();
})

//routes
app.use(loginRoutes);

app.get('/',loginController.getLogin);

app.get('/events', (req, res) => {
  const dummyEvents = [
    {
      id: 1,
      title: "Dinner Party",
      date: "2025-05-01",
      locationName: "Venue 1",
      user_id: 1
    },
    {
      id: 2,
      title: "TEDTalk",
      date: "2025-06-15",
      locationName: "Balboa Theater",
      user_id: 2
    }
  ];
  const currentUserId = req.session?.user_id || null;
  res.render('events', {events: dummyEvents, current_user_id: currentUserId});
});

app.get('/events/new', (req, res) => {
  if (!req.session?.authenticated) {
    return res.redirect('/');
  }
  res.render('add-event');
});

app.get("/dbTest", async(req, res) => {
  let sql = "SELECT CURDATE()";
  const [rows] = await conn.query(sql);
  res.send(rows);
});//dbTest

app.use(errorController.get404);//404

app.listen(3000, ()=>{
  console.log("Express server running on port: " + 3000);
})

