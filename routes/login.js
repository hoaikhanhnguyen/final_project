const express = require('express')
const bcrypt = require("bcrypt");
const router = express.Router()

// middleware that is specific to this routes
router.post('/login', async(req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // remove after database is connected
  let passwordHash = '$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6';
  const match = await bcrypt.compare(password, passwordHash);
  console.log(match);
  if (match) {
    req.session.authenticated = true;
    res.render('welcome', { current_user: username, password: password });
  } else {
    res.redirect('/');
  }

  // uncomment after database is connected
  // let passwordHash = '';
  // let sql = 'SELECT * FROM users WHERE username = ?';
  // const [rows] = await conn.query(sql, [username]);
  // if (rows.length > 0) {
  //   passwordHash = rows[0].password;
  // }
  // let match = await bcrypt.compare(password, passwordHash);
  //
  // if (match) {
  //   req.session.authenticated = true;
  //   res.render('welcome', { current_user: username, password: password });
  // } else {
  //   res.redirect('/');
  // }
})

router.get('/myProfile', isAuthenticated, (req, res) => {
  res.render('profile')
})

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

//middleware
function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = router