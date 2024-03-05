const express = require('express');
const authController = require('../controler/authantication');
const validation = require('../middleware/validation');
const router = express.Router();

router.post('/signup',validation,authController.signup);
router.post('/login',authController.login);
router.post('/seller-signup',validation,authController.seller_signup);
router.post('/seller-login',validation,authController.seller_login);
 

module.exports = router;