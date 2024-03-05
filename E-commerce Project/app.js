const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./router/auth');
const productRouter = require('./router/product')
const cartRouter = require('./router/cart')
const orderRouter = require('./router/order');

app =express();

app.use(express.json());

app.use('/auth',authRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/',(req,res)=>{
    res.send('We are in / directory');
});

app.listen(3000,()=>{
    console.log('Server is listening!');
});