import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema=new Schema(
    {
        _studentId:{
            type:String,
            required:true,
            unique:true
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        Username:{
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
        phone_no:{
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

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            Username: this.Username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    )
}

studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d'
        }
    )
}

export const Student=mongoose.model('Student',studentSchema);
