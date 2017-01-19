var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var httpStatus = require('http-status');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config = require('./config');
var routes = require('./routes/index.route');
var APIError = require('./helpers/APIError');

var app = express();

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', function() {
  throw new Error('unable to connect to database: ' + config.db);
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.session_secret,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: 432000000
    },
    name: '_ssid',
    resave: false,
    saveUninitialized: false
}));

// disable cache, prevent 304 Not Modified
app.disable('etag'); 

// set up req.isAuthenticated
app.use((req, res, next) => {
  req.isAuthenticated = function() {
    return req.session.user;
    // return req.session.user && req.session.userId;
  }
  next();
});

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
 if (!(err instanceof APIError)) {
   var apiError = new APIError(err.message, err.status, err.isPublic);
   return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new APIError('API Not Found', httpStatus.NOT_FOUND);
  next(err);
});

// error handler, send stacktrace only during development
app.use(function(err, req, res, next) {
  res.status(err.status).json({
    error: err.isPublic ? err.message : httpStatus[err.status],
    stack: req.app.get('env') === 'development' ? err.stack : {}
  })
});

module.exports = app;
