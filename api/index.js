import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();



mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.log(err);
    });

    const __dirname = path.resolve();


const app = express();
app.use(express.json()); // allow json as input to the server (req)
app.use(cookieParser());


app.listen(3000,()=>{
    console.log('Server is running');
})


app.get('/test',(req,res)=>{
    return res.send('hello world');
})

//api routes

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

//listing router

app.use('/api/listing',listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})



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