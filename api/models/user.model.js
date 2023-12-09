import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        requierd: true,
        unique: true,
    },
    email:{
        type:String,
        requierd: true,
        unique: true,
    },
    password:{
        type:String,
        requierd: true,
    },
    avatar:{
        type: String,
        default : "https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg",
        

    }
},
{
    timestamps:true
} );

const User = mongoose.model('User',userSchema);
export default User;
//name of model is Uppercase and sigular mongodb automatically add s 