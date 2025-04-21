import express from 'express';
import session from "express-session";
import loginRoutes from "./routes/login.js";
import flash from "connect-flash";

import loginController from "./controllers/login.js";
import errorController from "./controllers/error.js";

import bodyParser from "body-parser";
import conn from "./utils/database.js";

//for database access
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//to parse form submisisons, gives access to req.body in POST
app.use(bodyParser.urlencoded({ extended: true }));

//session settings
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//initialize flash messages
app.use(flash());

//middleware
app.use((req,res,next)=>{
  res.locals.isLoggedIn = req.session.authenticated;
  res.locals.path = req.path;
  next();
})

//routes
app.use(loginRoutes);

app.get('/',loginController.getLogin);

app.get('/events', async (req, res) => {
  const dummyEvents = [
    {
      id: 1,
      title: "Dinner Party",
      date: "2025-05-01",
      location_name: "Venue 1",
      user_id: 1
    },
    {
      id: 2,
      title: "TEDTalk",
      date: "2025-06-15",
      location_name: "Balboa Theater",
      user_id: 2
    }
  ];

  let sql = `SELECT *, Events.id
        FROM Events
        JOIN Locations 
             ON Events.location_id = Locations.id`;

  const [rows] = await conn.query(sql);
  const currentUserId = req.session?.user_id || null;
  res.render('events', {events: rows, current_user_id: currentUserId});
});


//route - add new event, track by user ID
app.get('/events/new', async (req, res) => {
  if (!req.session?.authenticated) {
    return res.redirect('/');
  }

  try {
    //retrieve locations
    const [locations] = await conn.query("SELECT * FROM Locations");

    //pass location info to frm
    res.render('add-event', { locations }); 
  } catch (err) {
    console.error("Error locading locations: ", err);
    res.status(500).send("Server error");
  }  
});

//rote to handle form submission and save new event to database
app.post("/events", async (req, res) => {

  const {
    location_name,
    location_street,
    location_city,
    location_zip,
    location_state
  } = req.body;

  const insertLocationQuery = `
    INSERT INTO Locations (location_name, location_street, location_city, location_zip, location_state)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [locationResult] = await conn.query(insertLocationQuery, [
    location_name,
    location_street,
    location_city,
    location_zip,
    location_state
]);

const locationId = locationResult.insertId;


const {
  title,
  description,
  date,
  time,
  guestCount,
  av_needed,
  setup_type
} = req.body;

const hostId = req.session.user_id;

const insertEventQuery = `
  INSERT INTO Events 
    (host_id, title, date, time, location_id, guest_count, description, av_needed, setup_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const [eventResult] = await conn.query(insertEventQuery, [
  hostId,
  title,
  date,
  time,
  locationId,
  guestCount,
  description,
  av_needed === "true",
  setup_type
]);

res.redirect("/events");

});

app.get('/events/:id/edit', async (req, res) => {
  const eventId = req.params.id;

  const [rows] = await conn.query(
    `SELECT Events.*, Locations.location_name, Locations.location_street, Locations.location_city, Locations.location_zip, Locations.location_state
     FROM Events
     JOIN Locations ON Events.location_id = Locations.id
     WHERE Events.id = ?`,
    [eventId]
  );

  const event = rows[0];
  console.log("Editing event:", event);
  res.render('edit-event', { event });
});


app.post('/events/:id/edit', async (req, res) => {
  const eventId = req.params.id;

  const {
    title,
    description,
    date,
    time,
    guestCount,
    av_needed,
    setup_type,
    location_name,
    location_street,
    location_city,
    location_zip,
    location_state
  } = req.body;

  await conn.query(
    `UPDATE Locations SET
      location_name = ?, location_street = ?, location_city = ?, location_zip = ?, location_state = ?
     WHERE id = (
       SELECT location_id FROM Events WHERE id = ?
     )`,
    [
      location_name,
      location_street,
      location_city,
      location_zip,
      location_state,
      eventId
    ]
  );

  await conn.query(
    `UPDATE Events SET
      title = ?, description = ?, date = ?, time = ?, guest_count = ?, av_needed = ?, setup_type = ?
     WHERE id = ?`,
    [
      title,
      description,
      date,
      time,
      guestCount,
      av_needed === "true",
      setup_type,
      eventId
    ]
  );

  res.redirect('/events');
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

