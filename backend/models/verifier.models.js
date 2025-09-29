import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const verifierSchema=new Schema(
    {
        _verifierId:{
            type:String,
            required:true,
            unique:true,
            primarykey:true
        },
        verifierName:{
            type:String,
            required:true
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
        walletAddress:{
            type:String,
            required:true,
            unique:true
        },
        phonenumber:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
);
export const Verifier=mongoose.model('Verifier',verifierSchema);