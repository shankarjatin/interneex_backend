// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailerConfig')
// const API_BASE_URL =  'http://localhost:3000';
const API_BASE_URL =  'https://interneex.com/';


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, number: user.number},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, number, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            number,
            password,
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = req.user; // User is set in the middleware
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                hasPurchasedCourse: user.hasPurchasedCourse,
                courseDetails: user.courseDetails ? {
                    courseName: user.courseDetails.courseName,
                    courseDuration: user.courseDetails.courseDuration,
                    purchaseDate: user.courseDetails.purchaseDate,
                    receiptId: user.courseDetails.receiptId,
                } : null,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Email received for password reset:", email);

    let user;

    try {
        // Check if user exists
        user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        console.log("Reset token generated:", resetToken);

        // Create reset URL pointing to React frontend
        const resetUrl = `${API_BASE_URL}/reset-password?token=${resetToken}`;
        console.log("Reset URL:", resetUrl);

        // Email message
        const message = `
        Dear User,
    
        You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link to reset your password:
    
        ${resetUrl}
    
        If you did not request this, please ignore this email.
    
        Best regards,
        Modgenics Technology Solutions
    `;
    
        // Mail options
        const mailOptions = {
            from: 'sales@modgenics.co',
            to: user.email,
            subject: 'Password Reset Request',
            text: message,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
                return res.status(500).json({ message: 'Failed to send email.' });
            }
            console.log("Email sent successfully:", info.response);
            res.status(200).json({ message: 'Email sent successfully.' });
        });
        
    } catch (error) {
        console.error("Error during forgot password:", error);

        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: 'Server error' });
    }
};



// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    const { token } = req.query; // Get the token from the query parameters
    const { password } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Hash the token and find the user
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // Set the new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Generate new token for authentication after password reset
        const newToken = generateToken(user);

        res.status(200).json({
            success: true,
            token: newToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    forgotPassword,
    resetPassword,
};
