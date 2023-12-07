import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
export const signup = async (req,res) =>{
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);       //hash sync(means it's awiat) 10 is salt 
    const newUser = new User({username,email,password:hashedPassword});
    try{
        await newUser.save();
        return res.status(201).json("User created succesfully");    
    }catch(err){
        return res.status(500).json(err.message);
    }
}