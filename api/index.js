import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import { test } from './controllers/user.controller.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.log(err);
    });




const app = express();
app.use(express.json()); // allow json as input to the server (req)


app.listen(3000,()=>{
    console.log('Server is running');
})


app.get('/test',(req,res)=>{
    return res.send('hello world');
})

//api routes

app.use('/api/user',test);
app.use('/api/auth',authRouter);

//error middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode : statusCode,
        message,
    });
})