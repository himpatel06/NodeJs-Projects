const pool = require('../config/dbconnection');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validateSignup} = require('../middleware/joi-validation');
const authModel = require('../model/auth');

const signup = async (req,res)=>{
   // const error = validationResult(req);

   // if(!error.isEmpty()) return res.status(400).json({error:true, message:error, data:null});

   

    const user = req.body;
    const get_customer = await authModel.get_customer_byEmail(user.email);
    try{
        if(get_customer.length > 0) return res.status(400).json({error:true, message:"Email already exist.", data:null});
        const hashedPassword = await bcrypt.hash(user.password,10);
        await authModel.insert_into_customer(user);      
        if(err)return res.status(400).json({error:true,message: err,data:null});
        res.status(200).json({error:false, message:"Signup successfull.", data:null});  
    }
    catch(err){
        console.log(err);
    }
    
}

const login = async (req,res)=>{
   // const {error,value} = validateSignup(req.body);

  // if(error) console.log(error);
 
    const user = req.body;
    const get_user = await authModel.get_customer_byEmail(user.email);
    try{
        //console.log(result.rows);
       if(get_user.length == 0)return res.status(400).json({error:true, message:"User Doesnot Exist", data:null});
  
        const auth = get_user[0];
        const pass = await bcrypt.compare(user.password,auth.password);
        if(!pass) return res.status(400).json({error:true, message:"Incorrect Email or Password", data:null});
        const token = jwt.sign({"c_id":auth.c_id,"name":auth.name},'eVital',{expiresIn:'1h'});
        res.status(200).json({error:false, message:"Login Successfull", data:{token}});
        
    }
    catch(err){
        res.status(400).json({error:true, message:'e'+err, data:null});
    }
   
}


const seller_signup = async (req,res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()) return res.status(400).json({error:true, message:error, data:null});

    const user = req.body;
    const get_seller = await pool.query(`select * from seller where email = $1`,[user.email]);
    try{
        
        if(get_seller.rows.length > 0) return res.status(400).json({error:true, message:"Email already exist.", data:null});
        const hashedPassword = await bcrypt.hash(user.password,10);
        await pool.query(`insert into seller (name,email,password) values($1,$2,$3)`,
        [user.name,user.email,hashedPassword]);
        res.satus(200).json({error:false, message:"Seller Signup successful.", data:null});         
        
    }
    catch(err){
        return res.satus(200).json({error:true, message:err, data:null});
    }
    
}

const seller_login = async (req,res)=>{
    const user = req.body;
    const result = await pool.query(`select * from seller where email=$1`,[user.email]);
    try{
        
       if(result.rows.length == 0)return res.status(400).send('User dont Exist!');
  
        const auth = result.rows[0];
        const pass = await bcrypt.compare(user.password,auth.password);
        if(!pass) return res.status(400).json({error:true, message:"Incorrect Email or Password", data:null});
        const token = jwt.sign({"s_id":auth.s_id},'eVital',{expiresIn:'1h'});
        res.status(200).json({error:false, message:{token}, data:null});
        
    }
    catch(err){
        return res.status(400).json({error:true, message:'e'+err, data:null});
    }
   
}

module.exports = {signup,login,seller_signup,seller_login};
