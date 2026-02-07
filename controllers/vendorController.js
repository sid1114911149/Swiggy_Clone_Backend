const Vendor=require("../models/Vendor");
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const dotEnv=require('dotenv');
const firm=require('../models/Firm');
dotEnv.config();
const secretKey=process.env.WhatisYourName;

const add_vendor=async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const Email=await Vendor.findOne({email});
        if(Email){
            console.log(`Email already Exists`);
            res.status(404).json({message:"already entry Exists"});
            return ;
        }
        const NewPassword=await bcrypt.hash(password,12);
        const  vendor=new Vendor({username,email,password:NewPassword})
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:'1h'});
        await vendor.save();
        res.status(201).json({vendor,token});

    }catch(error){
        console.log(`error Occured during Vendor creation:${error}`);
        res.status(501).json({message:"Error Occured"});
    }
}
const vendorLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            consol.log(`No such email exists`);
            return res.status(401).json({message:"Error Occured"});
        }
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"});
        let firmId=null;
        if(vendor.firm.length >0 ){
            firmId=vendor.firm[0]._id;
        }
        res.status(201).json({vendor,token,firmId});
        console.log(`${email} is successfully LoggedIN with Token:${token}`);
    }catch(error){
        console.log(`error Occured during Vendor retreival:${error}`);
        res.status(501).json({message:"Error Occured"});
    }
}
const getAllvendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');

        res.status(200).json({
            success: true,
            count: vendors.length,
            vendors
        });
    } catch (error) {
        console.error(`Error occurred during vendors retrieval: ${error}`);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const get_vendor=async (req,res)=>{
    try{
        const vendor=await Vendor.findById(req.params.id);
        if(!vendor){
            console.log(`No such vendor Exists with given ID`);
            return res.status(501).json({message:"No such entry Exists"});
        }
        res.status(201).json(vendor);
    }catch(error){
        console.log(`error Occured during Vendor retreival:${error}`);
        res.status(501).json({message:"Error Occured"});
    }
}

const deleteVendor=async (req,res)=>{
    try{
        const vendor=await Vendor.findByIdAndDelete(req.params.id);
        if(!vendor){
            return res.status(404).json({message:"No Vendor Found"})
        }
        res.status(202).json(vendor);
    }catch(error){
        console.log(`Error occured during vendor Deletion:${error}`);
        res.status(404).json({message:"Error during vendor Deletion"});
    }

}

module.exports={add_vendor,get_vendor,vendorLogin,getAllvendors,deleteVendor};