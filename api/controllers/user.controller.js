import {errorHandler} from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
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