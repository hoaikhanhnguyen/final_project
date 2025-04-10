const express = require('express')
const bcrypt = require("bcrypt");
const router = express.Router()

// middleware that is specific to this routes
router.post('/login', async(req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let username = req.body.username;
  let password = req.body.password;

  // remove after database is connected
  let passwordHash = '$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6';
  const match = await bcrypt.compare(password, passwordHash);
  if (match) {
    req.session.authenticated = true;
    res.render('welcome', {
      path: '/welcome',
      isLoggedIn: true,
      current_user: username,
      errorMessage: message
    });
  } else {
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/');
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
  // res.render('welcome', {
  //   path: '/welcome',
  //   isLoggedIn: true,
  //   current_user: username,
  //   errorMessage: message
  // });
  // } else {
  // req.flash('error', 'Invalid email or password.');
  //   res.redirect('/');
  // }
})

router.get('/myProfile', isAuthenticated, (req, res) => {
  res.render('profile', { path: '/myProfile' });
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