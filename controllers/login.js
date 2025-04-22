const bcrypt = require("bcrypt");
const conn = require("../utils/database.js");

exports.getLogin =(req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login',
      {path: "/login", isLoggedIn: false, errorMessage: message});
}

exports.postLogin = async(req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  let email = req.body.email;
  let password = req.body.password;

  let passwordHash = '';
  let id = '';
  let sql = 'SELECT * FROM Hosts WHERE email = ?';
  const [rows] = await conn.query(sql, [email]);
  if (rows.length > 0) {
    passwordHash = rows[0].password;
    id = rows[0].id;
    name = rows[0].name;
  }

  let match = await bcrypt.compare(password, passwordHash);

  if (match) {
    req.session.authenticated = true;
    req.session.user_id = id;
    req.session.user = email;
    req.session.username = name;
  res.render('welcome', {
    path: '/welcome',
    isLoggedIn: true,
    current_user: email,
    errorMessage: message,
    username: name,
  });
  } else {
  req.flash('error', 'Invalid email or password.');
    res.redirect('/');
  }
}

exports.getWelcome = (req, res) => {
  res.render('welcome', {
    path: '/welcome',
    isLoggedIn: true,
    current_user: req.session.user,
    username: req.session.username
  });
}

exports.getSignUp = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('signup', {
    path: '/signup',
    isLoggedIn: false,
    errorMessage: message
  });
}

exports.postSignUp = async(req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let reenter_password = req.body.reenterPassword;

  let sql = 'SELECT * FROM Hosts WHERE email = ?';
  const [rows] = await conn.query(sql, [email]);
  if (rows.length > 0) {
    req.flash('error', 'Email already exists. Use a different email address.');
    return res.redirect('/signup');
  }

  if (password !== reenter_password) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/signup');
  }

  let passwordHash = await bcrypt.hash(password, 12);
  let sql2 = 'INSERT INTO Hosts(name, email, password) VALUES (?,?,?)';
  const [rows2] = await conn.query(sql2, [name, email, passwordHash]);

  req.flash('error', 'Successfully created user.');
  return res.redirect('/signup');
}

exports.getLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}