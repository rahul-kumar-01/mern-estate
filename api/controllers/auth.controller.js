import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';


export const signup = async (req,res,next) =>{
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);       //hash sync(means it's awiat) 10 is salt 
    const newUser = new User({username,email,password:hashedPassword});
    try{
        await newUser.save();
        return res.status(201).json("User created succesfully");    
    }
    // Intially 
    // catch(err){
    //     return res.status(500).json(err.message);
    // }
    //After adding middleware
    catch(err){
        next(err);
        // next(errorHandler(500,'error from function')); // we created  this err used when password mistach by using upper line it's not error  
    }
}