const Vendor = require('../models/Vendor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.WhatisYourName;

/* ================= REGISTER VENDOR ================= */

const addVendor = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const vendor = new Vendor({
      username,
      email,
      password: hashedPassword
    });

    await vendor.save();

    const token = jwt.sign(
      { vendorId: vendor._id },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      vendor,
      token
    });

  } catch (error) {
    console.error('Vendor Register Error:', error);
    res.status(500).json({
      message: 'Error occurred during vendor registration'
    });
  }
};

/* ================= LOGIN ================= */

const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email }).populate('firm');
    if (!vendor) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { vendorId: vendor._id },
      secretKey,
      { expiresIn: '1h' }
    );

    const firmId = vendor.firm.length > 0 ? vendor.firm[0]._id : null;

    res.status(200).json({
      vendor,
      token,
      firmId
    });

  } catch (error) {
    console.error('Vendor Login Error:', error);
    res.status(500).json({
      message: 'Error occurred during login'
    });
  }
};

/* ================= GET ALL VENDORS ================= */

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('firm');

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors
    });

  } catch (error) {
    console.error('Get Vendors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/* ================= GET SINGLE VENDOR ================= */

const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor
      .findById(req.params.id)
      .populate('firm');

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    res.status(200).json(vendor);

  } catch (error) {
    console.error('Get Vendor Error:', error);
    res.status(500).json({
      message: 'Error occurred during vendor retrieval'
    });
  }
};

/* ================= DELETE VENDOR ================= */

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      message: 'Vendor deleted successfully'
    });

  } catch (error) {
    console.error('Delete Vendor Error:', error);
    res.status(500).json({
      message: 'Error occurred during vendor deletion'
    });
  }
};

/* ================= EXPORTS ================= */

module.exports = {
  addVendor,
  vendorLogin,
  getAllVendors,
  getVendor,
  deleteVendor
};
