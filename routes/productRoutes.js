const express = require('express');
const router = express.Router();
const path = require('path');
const productController = require('../controllers/productController');

/* ================= ADD PRODUCT ================= */
router.post(
  '/add-product/:firmId',
  productController.addProduct
);

/* ================= GET ALL PRODUCTS OF A FIRM ================= */
router.get('/:firmId/products', productController.getAllProducts);

/* ================= GET SINGLE PRODUCT ================= */
router.get('/getProduct/:id', productController.getProduct);

/* ================= SERVE PRODUCT IMAGE ================= */
router.get('/uploads/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', req.params.imageName);
  res.sendFile(imagePath, err => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

/* ================= DELETE PRODUCT ================= */
router.delete('/delete/:productId', productController.deleteProduct);

module.exports = router;
