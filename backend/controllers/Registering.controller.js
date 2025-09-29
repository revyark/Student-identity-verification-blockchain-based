import {asyncHandler} from "../utils/asyncHandler.js";
import {Institute} from "../models/institute.models.js";
import {Verifier} from "../models/verifier.models.js";
import {Student} from "../models/user.models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import csv from 'csv-parser';

const registerInstitute=asyncHandler(async(req,res)=>{
    const {instituteName,instituteType,email,password,walletAddress,phonenumber,addressLine1,addressLine2,region,pincode,state,country,instituteCode,description}=req.body;
    if(!instituteName||!instituteType||!email||!password||!walletAddress||!phonenumber||!addressLine1||!pincode||!state||!country||!instituteCode||!description){
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    const existingInstitute=await Institute.findOne({$or:[{email},{walletAddress}]});
    if(existingInstitute){
        res.status(400);
        throw new Error('Institute with this email or wallet address already exists');
    }

    // Validate institute code if type is university
    if (instituteType === 'university') {
        const isValidCode = await new Promise((resolve, reject) => {
            let found = false;
            fs.createReadStream('check_verified_institution.csv')
                .pipe(csv())
                .on('data', (row) => {
                    if (row.institute_id === instituteCode) {
                        found = true;
                    }
                })
                .on('end', () => {
                    resolve(found);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
        if (!isValidCode) {
            return res.status(400).json({message: 'not verified'});
        }
    }

    const hashedPassword=await bcrypt.hash(password,10);
    const newInstitute=new Institute({
        _instituteId:instituteCode,
        instituteName,
        instituteType,
        email, 
        password:hashedPassword,
        walletAddress,
        phonenumber,
        addressLine1,
        addressLine2,
        region,
        pincode,
        state,
        country,
        description
    });
    await newInstitute.save();
    if (!newInstitute) {
        res.status(500);
        throw new Error('Failed to register institute');
    }
    return res.status(201).json({message:'Institute registered successfully'});
});

const registerVerifier=asyncHandler(async(req,res)=>{
    const {verifierName,email,password,walletAddress,phone,city,state,country,verifierCode,description}=req.body;
    if (!verifierCode||!verifierName||!email||!password||!walletAddress||!phone||!city||!state||!country||!description){
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    const existingVerifier=await Verifier.findOne({$or:[{email},{walletAddress}]});
    if(existingVerifier){
        res.status(400);
        throw new Error('Verifier with this email or wallet address already exists');
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newVerifier=new Verifier({
        _verifierId:verifierCode,
        verifierName,
        email,
        password:hashedPassword,
        walletAddress,
        phonenumber:phone,
        city,
        state,
        country,
        description 
    });
    await newVerifier.save();
    if (!newVerifier) {
        res.status(500);
        throw new Error('Failed to register verifier');
    }
    return res.status(201).json({message:'Verifier registered successfully'});
});

const registerStudent=asyncHandler(async(req,res)=>{
    const {firstName,lastName,Username,email,password,phone_no,walletAddress,dateofbirth,credentials}=req.body;
    if(!firstName||!lastName||!Username||!email||!password||!phone_no||!walletAddress||!dateofbirth){
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    const existingStudent=await Student.findOne({$or:[{email},{walletAddress}]});
    if (existingStudent){
        res.status(400);
        throw new Error('Student with this email or wallet address already exists');
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newStudent=new Student({
        _studentId: Username,
        firstName,
        lastName,
        Username,
        email,
        password:hashedPassword,
        phone_no,
        walletAddress,
        dateofbirth,
        credentials
    });
    await newStudent.save();
    if (!newStudent) {
        res.status(500);
        throw new Error('Failed to register student');
    }
    return res.status(201).json({message:'Student registered successfully'});
});
export {registerInstitute,registerVerifier,registerStudent};
