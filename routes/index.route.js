var express = require('express');
var userRoutes = require('./user.route');
var authRoutes = require('./auth.route');
var router = express.Router();

// mount user routes at /users
// router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
