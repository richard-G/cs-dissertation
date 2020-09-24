var express = require('express');
var router = express.Router();
var passport = require('../helpers/passport');
var conn;

/* GET home page. */
router.get('/', passport.authenticate('getUser'), function(req, res, next) {
  // set req action, for analytics
  req.action = 'loadApp';
  
  res.status(200);
  res.json({ message: 'logged in', success: true, method: 'jwt token in storage ', role: req.user.role});
});


module.exports = router;
