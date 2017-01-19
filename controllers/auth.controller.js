var httpStatus = require('http-status');
var User = require('../models/user.model');
var APIError = require('../helpers/APIError');

// sample user, used for authentication
const user = {
  username: 'lydia',
  password: 'lydia'
};

/**
 * Login
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  if (!req.body.username || !req.body.password ) {
    return next(new APIError('Invalid params', httpStatus.BAD_REQUEST));
  }
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return next(new APIError('Error')); // db error
    }
    if (!user) { 
      return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED));
    }
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) {
        return next(new APIError('Error')); // db error
      }
      if (!isMatch) {
        return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED));
      }
      req.session.user = user.username;
      req.session.userId = user.userId;
      res.json({
        user: user.username,
        userId: user.UserId,
      });
    });
  });
}

function register(req, res, next) {
  console.log(req.body);
  if (!req.body.username || !req.body.password || req.body.password.length < 8) {
    return next(new APIError('Invalid params', httpStatus.BAD_REQUEST));
  }

  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) {
      return next(new APIError('Error'));
    }
    res.json({
      status: 'success'
    });
  })
}
function logout(req,res,next){
  req.session.user = null;
  res.json({
    status:'success'
  });

}


/**
 * Status
 * @param req
 * @param res
 * @returns {*}
 */
function status(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
    return res.json(
      req.isAuthenticated() ? { 
        user: req.session.user,
        userId: req.session.userId
      } : {
        user: null,
        userId: null
      }
    );
}

exports.login = login;
exports.register = register;
exports.status = status;
exports.logout = logout;