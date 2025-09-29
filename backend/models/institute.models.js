import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const instituteSchema=new Schema(
    {
        _instituteId:{
            type:String,
            required:true,
            unique:true,
            primarykey:true
        },
        instituteName:{
            type:String,
            required:true
        },
        instituteType:{
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
        addressLine1:{
            type:String,
            required:true
        },
        addressLine2:{
            type:String
        },
        region:{
            type:String
        },
        pincode:{
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
            type:String
        }
});

export const Institute=mongoose.model('Institute',instituteSchema);