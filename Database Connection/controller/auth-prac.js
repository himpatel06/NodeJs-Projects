const pool = require('../config/connection');
const LoacalStrategy = require('passport-local').Strategy;

const initialize = (passport)=>{
    passport.use(new LoacalStrategy(
        (username,password)=>{
            pool.query(`select * from users where username=$1`,[username], (err,result)=>{
                const user = result.row[0];
                if(!user) return done(null,false,{message:"User not found"});

                if(user.password !=password) return done(null,false,{message:""});

                return done(null,user);
            })
    }));

    passport.serializeUser((user,done)=>{
        return done(null,user.id);
    });

    passport.deserializeUser9((id,done)=>{});


};

const authenticate = (req,res,next)=>{
    if(req.isAuthenticated())return next();
    
}