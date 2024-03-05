const express = require('express');
const {check,validationResult} = require('express-validator');
const router = express.Router();
const pool = require('../config/dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login',[
    check("email","Please Enter Valid Email").isEmail(),
    check("password","Please Enter Valid Password").isLength({
        min:6
    })

],(req,res)=>{
    const user = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).send(errors);
    }
    else{
        
        pool.query(`select * from users where username = $1;`,[user.email],(err,result)=>{
            if(err) return res.send(err);

            const authUser = result.rows[0];
            
            if(user.email === authUser.username && user.password === authUser.password) 
            return res.send('signin successfull');
            //else return res.send('Invalid Credentials');
        })
    }
   
});


router.post('/signup',[

    check("email").isEmail(),
    check("password").isLength({min:6})
], (req,res)=>{
    const errors = validationResult(req);
    const user = req.bodyl
    if(!errors.isEmpty())return res.send(errors);

    pool.query(`select * from users where username = $1`,[user.email],async (err,result)=>{
        if(err)return res.send(err);
        
        if(result.rows.length>0)return res.send('user already exist');

        const hashedPassword = await bcrypt.hash(user.password, 10);
    pool.query(`insert into users values(3,$1,$2)`,[user.email,hashedPassword],async (err,result)=>{
        if(err) return res.send(err);

    });
    })


});


module.exports = router;