const JwtStrategy = require('passport-jwt').Strategy;
var Strategy = require('passport-local').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const PUB_KEY = fs.readFileSync('./keys/public.pub', 'utf8');
const conn = require('./connection');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY
};


passport.serializeUser(function(user, done) {
    done(null, {email: user.email, role: user.role, id: user.id});
});

passport.deserializeUser(function(user, done) {
    done(null, user);
})

passport.use('local', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
      const data = req.body;
      const inputs = Object.values(data);
    conn.query("SELECT * FROM users WHERE email = ?", email, function(err, rows) {
        if (err) {
            return done(err);
        }
        // user enters a non-existant email
        if (!rows.length) {
            return done(null, false, { message: 'email not found' });
        }
        // user enters the wrong password
        if (!(rows[0].password == password)) {
            return done(null, false, { message: 'incorrect password' });
        }
        return done(null, rows[0]);
    });
}));

passport.use('getUser', new JwtStrategy(options, function(jwt_payload, done) {
    conn.query("SELECT * FROM users WHERE id = ?", jwt_payload.id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        // return user object in cb
        if (!user[0]) {
            return done(null, false);
        } else {
            return done(null, user[0]);
        }
    })
}))


module.exports = passport;