const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

/* ================= REGISTER ================= */
router.post('/register', vendorController.addVendor);

/* ================= LOGIN ================= */
router.post('/login', vendorController.vendorLogin);

/* ================= DELETE VENDOR ================= */
router.delete('/delete/:id', vendorController.deleteVendor);

/* ================= GET ALL VENDORS ================= */
router.get('/get-vendors', vendorController.getAllVendors);

/* ================= GET SINGLE VENDOR ================= */
router.get('/get-details/:id', vendorController.getVendor);

module.exports = router;
