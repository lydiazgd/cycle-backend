var mongoose = require('mongoose');
var httpStatus = require('http-status');
var bcrypt = require('bcrypt');
var APIError = require('../helpers/APIError');
var saltRounds = require('../config').SALT_WORK_FACTOR;
var autoIcrement = require('mongoose-auto-increment');
autoIcrement.initialize(mongoose);



/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  id:{type:Number},
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  // mobileNumber: {
  //   type: String,
  //   required: true,
  //   match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(autoIcrement.plugin,{model:'User',field:'UserId',startAt:0,incrementBy:1});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

/**
 * Methods
 */
UserSchema.method({
  verifyPassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
});

/**
 * Statics
 */
UserSchema.static({
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   */
  get(id, cb) {
    return this.findById(id, cb);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   */
  list(conf, cb) {
    if (typeof conf === 'function') {
      cb = conf;
      conf = {};
    }
    conf = typeof conf !== 'undefined' ? conf : {};
    var skip = typeof conf.skip !== 'undefined' ? conf.skip : 0;
    var limit = typeof conf.limit !== 'undefined' ? conf.limit : 50;
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(cb);
  }
});

/**
 * @typedef User
 */

module.exports = mongoose.model('User', UserSchema);