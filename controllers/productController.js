const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= ADD PRODUCT ================= */

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
      return res.status(404).json({ message: "No such firm exists" });
    }

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

/* ================= GET ALL PRODUCTS ================= */

const getAllProducts = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ message: "No firm found" });
    }

    const products = await Product.find({ firm: firmId });
    res.status(200).json(products);

  } catch (error) {
    console.log("Error during product retrieval:", error);
    res.status(500).json({
      message: "Error occurred during product retrieval"
    });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }

    res.status(200).json(product);

  } catch (error) {
    console.log("Error during product fetching:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/* ================= DELETE PRODUCT ================= */

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        message: "No product found with given ID"
      });
    }

    res.status(200).json({
      message: "Product successfully deleted"
    });

  } catch (error) {
    console.log("Error during product deletion:", error);
    res.status(500).json({
      message: "Error during product deletion"
    });
  }
};

/* ================= EXPORTS ================= */

module.exports = {
  addProduct: [upload.single('image'), addProduct],
  getAllProducts,
  getProduct,
  deleteProduct
};
