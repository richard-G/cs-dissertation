// path is called when a user attempts to log in. backend creates a connection with the db and verifies the user credentials (probably good to hash)

var express = require('express');
var router = express.Router();
var passport = require('../helpers/passport');
const issueJWT = require('../helpers/issueToken');

router.post('/', 
    passport.authenticate('local'),
    function(req, res) {
        req.action = 'login';
        const jwtToken = issueJWT(req.user);
        res.status(200);
        res.json({ message: 'logged in', success: true, token: jwtToken });
});

module.exports = router;
