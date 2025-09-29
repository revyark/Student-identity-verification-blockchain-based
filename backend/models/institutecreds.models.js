import mongoose,{Schema} from 'mongooose';
import bcrypt from 'brcypt.js';

const instituteCredsSchema=new Schema(
    {
        _id:{
            type:String,
            required:true,
            unique:true,
            primarykey:true
        },
        instituteId:{
            type:String,
            required:true
        },
        no_ofCredentialsIssued:{
            type:Number,
            required:true
        },
        no_ofCredentialsRevoked:{
            type:Number,
            required:true
        },
        no_ofVerifiedCredentials:{
            type:Number,
            required:true
        },
        no_ofPendingVerifications:{
            type:Number,
            required:true
        }
    },
    {timestamps:true
    }
);
export const InstituteCreds=mongoose.model('InstituteCreds',instituteCredsSchema);