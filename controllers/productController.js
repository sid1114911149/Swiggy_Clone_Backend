const Product=require('../models/Product');
const Firm=require("../models/Firm");
const multer=require('multer');
const dotEnv=require('dotenv');
const path=require("path");
dotEnv.config();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
const addProduct=async (req,res)=>{
    try{
        const {productName,price,bestseller,offer,category,description}=req.body;
        const image = req.file ? req.file.filename : null;
        const firm=await Firm.findById(req.params.firmId); // here I am using physical ID for firm .
        // If you use generate token during firm generation then it can be used as req.firmID
        if(!firm){
            return res.status(501).json({error:"No such File Exists"});
        }
        const product=new Product({productName,price,bestseller,offer,category,image,description,firm:firm._id});
        const savedProduct=await product.save();
        firm.product.push(savedProduct);
        await firm.save();
        res.status(201).json({
            message:"firm created Successfully",
            product
        })
    }catch(error){
        console.log(`Error occured during product creation:${error}`);
        res.status(404).json({message:"error Occured during product creation"});
    }
}

const getAllProducts=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({message:"No firm Found"});
        }
        const products=await Product.find({firm:firmId});
        res.status(201).json(products);
    }catch(error){
        console.log(`Error occured during product retrieval:${error}`);
        res.status(404).json({message:"error Occured during product retreival"});
    }
}

const deleteProduct= async(req,res)=>{
    try{
        const poductId=req.params.productId;
        const product=await Product.findByIdAndDelete(productId);
        if(!product){
            return res.status(501).json({message:"No product Found with Given ID"});
        }
        res.status(201).json({message:"Product is Successfully Deleted"});
    }catch(error){
        console.log(`eror Occured during Product deletion:${error}`);
        res.status(404).json({message:"Error during product deletion"});
    }
}


module.exports={
    addProduct:[upload.single('image'), addProduct],getAllProducts,deleteProduct
};