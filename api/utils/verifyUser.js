import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next) => {

    const token = req.cookies.access_token;
    if(!token)  return next(errorHandler(401,'Unauthorized'));
    console.log(token);
    console.log(process.env.JWT_SECRET);
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        console.log(user);
        if(err){
            console.log("err");
            return next(errorHandler(403,'Forbidden'));
        } 
        req.user = user;
        next();
    });   
}