// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = {
    registerUser,
    loginUser,
    getUserInfo
};
