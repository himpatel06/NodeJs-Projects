const express = require('express');
const authRouter = require('./routes/auth');


const app = express();
app.use(express.json());


app.use('/auth',authRouter);
app.use('/',(req,res)=>{
    res.send("In the / dir");
})

app.listen(3000,()=>{
    console.log("Listening to the searver!");
})