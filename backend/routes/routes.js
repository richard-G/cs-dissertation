var express = require('express');
var router = express.Router();
var passport = require('../helpers/passport');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const PUB_KEY  = fs.readFileSync('../helpers/keys/public.pub', 'utf8');
const PRIV_KEY = fs.readFileSync('../helpers/keys/private.pem', 'utf8');


router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {     try {
        if(err || !user){
          const error = new Error('An Error occurred')
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { id : user.id, email : user.email };
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign(body, PRIV_KEY, { algorithm: 'RS256'});

          console.log('signed jwt: ', token);
          //Send back the token to the user
          return res.json({ token });
        });     } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
  
  module.exports = router;