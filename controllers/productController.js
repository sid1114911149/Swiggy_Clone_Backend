const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');
const path = require('path');

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= ADD PRODUCT ================= */

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ message: 'Firm not found' });
    }

    const existingProduct = await Product.findOne({
      firm: firmId,
      productName
    });

    if (existingProduct) {
      return res.status(400).json({
        message: 'Product already exists for this firm'
      });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image: req.file ? req.file.filename : null,
      firm: firmId
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct._id);
    await firm.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });

  } catch (error) {
    console.error('Add Product Error:', error);
    res.status(500).json({
      message: 'Error occurred during product creation'
    });
  }
};

/* ================= GET ALL PRODUCTS ================= */

const getAllProducts = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const products = await Product.find({ firm: firmId });

    res.status(200).json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      message: 'Error occurred during product retrieval'
    });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      message: 'Internal server error'
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
        message: 'No product found with given ID'
      });
    }

    await Firm.updateOne(
      { _id: product.firm },
      { $pull: { products: productId } }
    );

    res.status(200).json({
      message: 'Product successfully deleted'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      message: 'Error during product deletion'
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
