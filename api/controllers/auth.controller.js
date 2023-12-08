import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import  jwt  from 'jsonwebtoken';


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

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid credential'));
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET );
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token ,
         {
            httpOnly: true, //no other 3rd party access to cookie
            // expires : new Date(Date.now() + 24*60*60*1000) //24 ?
            // maxAge: 
         }
        ).status(200).json({rest});  // here we send the valid user info also password so we have to remove it and return rest

    }catch(err){
        next(err);
    }
}