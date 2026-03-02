const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotEnv = require('dotenv');
const User = require('../models/User');

dotEnv.config();
const secretKey = process.env.WhatisYourName;

const Register = async (req, res) => {
    try {
        const { email, userName, mobile, address, password } = req.body;

        const ExistingUser = await User.findOne({ email });

        if (ExistingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email,
            userName,
            mobile,
            address,
            password: newPassword
        });

        await user.save();

        res.status(201).json({ message: "User Created Successfully" });

    } catch (error) {
        console.log(`Error occured during User Creation: ${error}`);
        res.status(500).json({ message: "Error during User Creation" });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const userToken = jwt.sign(
            { userId: user._id },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login Successful",
            token: userToken
        });

    } catch (error) {
        console.log(`Error occured during User Login: ${error}`);
        res.status(500).json({ message: "Error during User Login" });
    }
};

module.exports = { Register, Login };