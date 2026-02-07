const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.WhatisYourName;
// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Controller
const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : null;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        // if (vendor.firm.length > 0) {
        //     return res.status(400).json({ message: "One Vendor Can have Only one firm" });
        // }
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,                // ✅ saved
            vendor: vendor._id
        });
        // const token=jwt.sign({firmId:firm._id},secretKey,{expiresIn:'1h'});
        vendor.firm.push(savedFirm);
        await vendor.save();

        res.status(201).json({
            message: "Firm created successfully",
            firmId,
            // token
        });

    } catch (error) {
        console.error("Error during firm creation:", error);
        res.status(500).json({ error: "Server error during firm creation" });
    }
};

const getAllFirms = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendorId)
      .populate('firm');

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found"
      });
    }

    res.status(200).json({
      firms: vendor.firm
    });

  } catch (error) {
    console.error(`Error occurred during Firms retrieval:`, error);
    res.status(500).json({
      message: "Error occurred during Firms retrieval"
    });
  }
};

const deleteFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findByIdAndDelete(firmId);
        if (!firm) {
            return res.status(404).json({ message: "No firm found with given ID" });
        }
        res.status(202).json({ message: "Firm is successfully Deleted" });
    } catch (error) {
        console.log(`Error Occured during Firm Deletion:${error}`);
        res.status(501).json({ message: "Error Occured during firm deletion" });
    }
}



module.exports = {
    addFirm: [upload.single('image'), addFirm], deleteFirm,getAllFirms
};
