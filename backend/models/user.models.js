import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema=new Schema(
    {
        _id:{
            type:String,
            required:true,
            unique:true,
            primarykey:true
        },
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phonenumber:{
            type:String,
            required:true
        },
        walletAddress:{
            type:String,
            required:true,
            unique:true
        },
        dateofbirth:{
            type:Date,
            required:true
        },
        credentials:{
            type:Schema.Types.ObjectId,
            ref:'Credential'
        }
    },
    {timestamps:true}
);
export const User=mongoose.model('User',userSchema);
