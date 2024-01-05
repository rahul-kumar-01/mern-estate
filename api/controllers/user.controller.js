import {errorHandler} from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listings from '../models/listing.model.js';
export const test = (req,res)=>{
    res.json({
        message : 'hello'
    })
}

export const updateUser = async (req,res,next) => {
    console.log("asdf",req.body);
    if(req.user.id !== req.params.id) return next(errorHandler(401,'you can only update your account.'));
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {

            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                avatar: req.body.avatar,
            }
        },{ new: true });
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);

    }catch(error){
        next(error);
    }
}

export const deleteUser = async (req,res,next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can delete your own account'));
    }
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        return res.status(200).json({message: 'User has been deleted '});
    }catch(error){
        next(error);
    }
}

export const getUserListings  = async (req,res,next) =>{
    if(req.user.id === req.params.id) {
        try{
            const listing = await Listings.find({userRef : req.params.id});
            res.status(200).json(listing);
        }catch(error){
            next(error);
        }
    }
    else{
        return next(errorHandler(401,'You can only view your own listing'));
    }
}

export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
};

