const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

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

/* ================= ADD FIRM ================= */

const addFirm = async (req, res) => {
  try {
    const { firmName, area, offer } = req.body;

    const category = Array.isArray(req.body.category)
      ? req.body.category
      : [req.body.category];

    const region = Array.isArray(req.body.region)
      ? req.body.region
      : [req.body.region];

    const image = req.file ? req.file.filename : null;

    const firm = await Firm.create({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: req.vendorId
    });

    res.status(201).json({
      message: 'Firm created successfully',
      firmId: firm._id
    });

  } catch (error) {
    console.error("Add Firm Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL FIRMS ================= */

const getAllFirms = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendorId)
      .populate('firm');

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      firms: vendor.firm
    });

  } catch (error) {
    console.error('Get Firms Error:', error);
    res.status(500).json({
      message: 'Error occurred during firms retrieval'
    });
  }
};

/* ================= DELETE FIRM ================= */

const deleteFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const firm = await Firm.findByIdAndDelete(firmId);
    if (!firm) {
      return res.status(404).json({
        message: 'No firm found with given ID'
      });
    }

    await Vendor.updateOne(
      { _id: firm.vendor },
      { $pull: { firm: firmId } }
    );

    res.status(200).json({
      message: 'Firm successfully deleted'
    });

  } catch (error) {
    console.error('Delete Firm Error:', error);
    res.status(500).json({
      message: 'Error occurred during firm deletion'
    });
  }
};

/* ================= EXPORTS ================= */

module.exports = {
  addFirm: [upload.single('image'), addFirm],
  getAllFirms,
  deleteFirm
};
