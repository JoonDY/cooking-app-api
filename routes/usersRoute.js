var express = require('express');
var router = express.Router();
const users = require('../controllers/usersController');

router.post('/login', users.loginUser);
router.post('/signup', users.signupUser);

module.exports = router;
