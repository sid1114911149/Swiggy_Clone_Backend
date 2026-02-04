const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.WhatisYourName;

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, secretKey);

        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        req.vendorId = decoded.vendorId;   // ✅ attach to request
        next();

    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
