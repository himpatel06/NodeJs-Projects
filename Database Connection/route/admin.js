const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.get('/getUser',userController.getUser);
router.get('/getUser/:city',userController.getUserById);
//router.post('/postUser',userController.postUser);
router.post('/postUser',(req,res)=>{
    console.log("hello");
    console.log(req.body);
})

module.exports = router;