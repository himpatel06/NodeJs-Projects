const express= require('express');
const userRouter = require('./route/admin');
const authRouter = require('./route/auth');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const bodyParser = require('body-parser');



const {initialize} = require('./controller/authentication');
const app = express();

app.use(bodyParser.json());


initialize(passport);
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api',userRouter);
app.use('/auth',authRouter);

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/api/getUser',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);
app.get('/',(req,res)=>{
  res.send('In / page');
})





app.listen(3000,()=>{
    console.log('Server is listening');
})