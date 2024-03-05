const pool = require('../config/connection');
const LocalStartegy = require('passport-local').Strategy;

const initialize = (passport)=>{
    passport.use(new LocalStartegy(
        (username,password,done)=>{
            pool.query(`SELECT * from users where username = $1`,[username],(err,result)=>{
                if(err)return done(err);
                
                const user = result.rows[0];
                if(!user)return done(null,false,{message:"Invalide User"});
                if(user.password != password) done(null,false,{message:"Invalide Password!"});

                return done(null,user);
            });  
        }
        ));
        passport.serializeUser((user, done) => {
            done(null, user.id);
          });

          passport.deserializeUser((id, done) => {
            pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
                
              const user = result.rows[0];
              done(err, user);
            });
          });
          
}

const isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated())return next();
    else res.redirect('/');
}

module.exports = {initialize,isAuthenticated};