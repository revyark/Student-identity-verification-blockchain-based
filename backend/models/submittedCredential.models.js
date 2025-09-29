import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const submittedCredentialSchema=new Schema(
    {
        _id:{
            type:String,
            required:true,
            unique:true,
        },
        studentWalletAddress:{
            type:String,
            required:true
        },
        verifierWalletAddress:{
            type:String,
            required:true
        },
        credentialHash:{
            type:String,
            required:true
        },
        submissionDate:{
            type:Date,
            required:true
        },
        cloudinaryUrl: {
            type: String,
            required: true
        },
        cloudinaryPublicId: {
            type: String,
            required: true
        },        
        fileSize: {
            type: Number,
            required: true
        },        
        mimeType: {
            type: String,
            required: true
       },
    },{
        timestamps:true
    }
);
export const SubmittedCredential=mongoose.model('SubmittedCredential',submittedCredentialSchema);