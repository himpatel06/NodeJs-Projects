import express from 'express';
import {router as authRouter}  from './routes/auth';
import userRouter from './routes/user';
import productRouter from './routes/products'
import cartRouter from './routes/cart'
import orderRouter from './routes/order'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(express.json());


app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter)

app.listen(3000,()=>{
    console.log('Server is listening!');
})