import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const CredentialSchema=new Schema(
    {
        _id:{
            type:String,
            required:true,
            unique:true,
            primarykey:true
        },
        credentialName:{
            type:String,
            required:true
        },
        isssuerWalletAddress:{
            type:String,
            required:true
        },
        studentWalletAddress:{
            type:String,
            required:true
        },
        credentialHash:{
            type:String,
            required:true,
            unique:true
        },
        credentialType:{
            type:String,
            required:true
        },
        issueDate:{
            type:Date,
            required:true
        },
        expiryDate:{
            type:Date
        },
        issuerSignature:{
            type:String,
            required:true
        },
        cloudinaryUrl:{
            type:String
        },
        status:{
            type:String,
            required:true,
            enum:['issued','revoked'],
        },
        credentialScore:{
            type:Number,
            default:0
        },
        
    }
);

export const Credential=mongoose.model('Credential',CredentialSchema);