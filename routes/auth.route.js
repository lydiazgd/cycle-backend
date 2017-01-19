var express = require('express');
var authCtrl = require('../controllers/auth.controller');

var router = express.Router();


/** POST /api/auth/login  */
router.route('/login')
  .post(authCtrl.login);

/** POST /api/auth/register */
router.route('/register')
  .post(authCtrl.register);


router.route('/logout')
.get(authCtrl.logout);

/** GET /api/auth/status - Login status */
router.route('/status')
  .get(authCtrl.status);

module.exports = router;
