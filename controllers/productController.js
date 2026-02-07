<<<<<<< HEAD
const Product = require('../models/Product');
const Firm = require("../models/Firm");
const multer = require('multer');
const dotEnv = require('dotenv');
const path = require("path");
=======
const Product=require('../models/Product');
const Firm=require("../models/Firm");
const multer=require('multer');
const dotEnv=require('dotenv');
const path=require('path');
>>>>>>> de1916c10a0b723982836c8c2b94de2403a56c27
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
const addProduct = async (req, res) => {
    try {
        const {
            productName,
            price,
            bestseller,
            offer,
            category,
            description
        } = req.body;

        const image = req.file ? req.file.filename : null;

        const firm = await Firm.findById(req.params.firmId);
        if (!firm) {
            return res.status(404).json({ error: "No such Firm exists" });
        }

        // 🔒 Prevent duplicate product for same firm
        const existingProduct = await Product.findOne({
            firm: firm._id,
            productName
        });

        if (existingProduct) {
            return res.status(400).json({
                message: "Product already exists for this firm"
            });
        }

        const product = new Product({
            productName,
            price,
            bestseller,
            offer,
            category,
            image,
            description,
            firm: firm._id
        });

        const savedProduct = await product.save();

        firm.product.push(savedProduct._id);
        await firm.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error("Error during product creation:", error);
        res.status(500).json({
            message: "Error occurred during product creation"
        });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "No firm Found" });
        }
        const products = await Product.find({ firm: firmId });
        res.status(201).json(products);
    } catch (error) {
        console.log(`Error occured during product retrieval:${error}`);
        res.status(404).json({ message: "error Occured during product retreival" });
    }
}
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "No Product Found" });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.log(`Error Occured during Product Fetching:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
    try {
        const poductId = req.params.productId;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(501).json({ message: "No product Found with Given ID" });
        }
        res.status(201).json({ message: "Product is Successfully Deleted" });
    } catch (error) {
        console.log(`eror Occured during Product deletion:${error}`);
        res.status(404).json({ message: "Error during product deletion" });
    }
}


<<<<<<< HEAD
module.exports = {
    addProduct: [upload.single('image'), addProduct], getAllProducts, deleteProduct,getProduct
};
=======
module.exports={
    addProduct:[upload.single('image'), addProduct],getAllProducts,deleteProduct
};
>>>>>>> de1916c10a0b723982836c8c2b94de2403a56c27
