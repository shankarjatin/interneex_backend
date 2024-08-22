// controllers/adminController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Load environment variables
require('dotenv').config();

const adminEmail = "ADMIN_EMAIL@admin.com";
const adminPassword = "ADMIN_PASSWORD";
const jwtSecret = process.env.JWT_SECRET;

// Admin login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    // Generate JWT token
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// Middleware to verify the JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      console.log("No token provided");
      return res.status(403).json({ message: 'Access denied' });
    }
  
    try {
      const tokenWithoutBearer = token.startsWith('Bearer ')
        ? token.slice(7, token.length)
        : token;
  
      const verified = jwt.verify(tokenWithoutBearer, jwtSecret);
      console.log("Token verified successfully:", verified);
      req.user = verified; // Storing the verified token payload in the request object
      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return res.status(400).json({ message: 'Invalid token' });
    }
  };
  

// Fetch all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
