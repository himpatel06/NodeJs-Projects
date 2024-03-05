const express = require('express');
const authController = require('../controller/authentication');
const router = express.Router();


router.get('/login',(req,res)=>{
    res.send('In the login Page, Login Fail');
})
router.get('/dashboard',authController.isAuthenticated,(req,res)=>{
    res.send('You are in Deshboard');
})


module.exports = router;