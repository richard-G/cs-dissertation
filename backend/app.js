var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var coursesRouter = require('./routes/courses');
var participantsRouter = require('./routes/participants');
var threadsRouter = require('./routes/threads');
var commentsRouter = require('./routes/comments');
var votesRouter = require('./routes/votes');
var tokenRouter = require('./routes/token');
var deleteThreadRouter = require('./routes/delete-thread');
var bookmarkThreadRouter = require('./routes/bookmark-thread');
var achievementsRouter = require('./routes/achievements');

var passport = require('./helpers/passport');
// var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true
// }));
app.use(passport.initialize());
app.use(passport.session());


// allow CORS with ionic origins
const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://localhost:8101'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

// allows preflight request to be accepted
app.options('*', cors(corsOptions));


app.use('*', cors(corsOptions), function(req, res, next) {
  next();
});

// analytics middleware
app.use(function(req, res, next) {
  res.on('finish', function() {
    if (!req.user) {
      // console.log('request made without user object.');
    } else if (req.user.role === 'student' && req.action) {
      const conn = require('./helpers/connection');
      // construct payload for analytics [userID, action, timestamp]
      const data = {
        studentID: req.user.id,
        action: req.action,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      conn.query(`INSERT INTO analytics SET ?`, data,
        function(err, result) {
          if (err) throw err;
        });
    } 
  });
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/courses', coursesRouter);
app.use('/participants', participantsRouter);
app.use('/threads', threadsRouter);
app.use('/comments', commentsRouter);
app.use('/votes', votesRouter);
app.use('/token', tokenRouter);
app.use('/delete-thread', deleteThreadRouter);
app.use('/bookmark-thread', bookmarkThreadRouter);
app.use('/achievements', achievementsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
