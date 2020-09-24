var express = require('express');
var router = express.Router();
var passport = require('../helpers/passport');

/* returns the user object. */
router.get('/', passport.authenticate('getUser'), function(req, res, next) {
//   // set req action, for analytics
//   req.action = 'loadApp';
  
  res.status(200);
  res.json(req.user);
});


module.exports = router;
