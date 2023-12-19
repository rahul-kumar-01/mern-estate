import Listing from "../models/listing.model.js";
import {errorHandler} from '../utils/error.js'


export const createListing = async(req,res,next) => {
    try{
        console.log('asdfasf');
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }catch(err){
        next(err);
    }
}

export const deleteListing = async (req,res,next) => {
    console.log("asfdj');");
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        return next(errorHandler(401,'Listing not found'));
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only delete your own listing'));
    }

    try{
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json('Listing has been deleted');
    }catch(error){
        next(err);
    }


}

export const updateListing = async (req,res,next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(401,'Listing not found!'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only update your own listing '));
    }

    try{
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}        // you this this else you get previous one not updated one 
        );
        return res.status(200).json(updateListing);
    }catch(error){
        next(error);
    }
}

export const getListing = async (req,res,next) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'Listing not found'));
        }
        return res.status(200).json(listing);
    }catch(error){
        next(error);
    }
}