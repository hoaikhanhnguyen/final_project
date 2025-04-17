const express = require('express')
const router = express.Router()

const loginController = require("../controllers/login.js");

// middleware that is specific to this routes
router.post('/login', loginController.postLogin);

//logged in page used for testing
router.get('/myProfile', isAuthenticated, (req, res) => {
  res.render('profile', { path: '/myProfile' });
})

router.get('/logout', isAuthenticated, loginController.getLogout);

router.get('/welcome', isAuthenticated, loginController.getWelcome);

//middleware
function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = router