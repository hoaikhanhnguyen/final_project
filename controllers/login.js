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
  }

  let match = await bcrypt.compare(password, passwordHash);

  if (match) {
    req.session.authenticated = true;
    req.session.user_id = id;
  res.render('welcome', {
    path: '/welcome',
    isLoggedIn: true,
    current_user: email,
    errorMessage: message
  });
  } else {
  req.flash('error', 'Invalid email or password.');
    res.redirect('/');
  }
}

exports.getLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}