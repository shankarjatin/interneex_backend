// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Admin login route
router.post('/admin/login', adminController.adminLogin);

// Fetch all users (protected by JWT)
router.get('/admin/users', adminController.verifyToken, adminController.getAllUsers);

module.exports = router;
