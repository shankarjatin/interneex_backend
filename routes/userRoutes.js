// routes/auth.js
const express = require('express');
const { registerUser, loginUser, getUserInfo , forgotPassword, resetPassword} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authMiddleware, getUserInfo);
router.post('/forgotPassword', forgotPassword);
router.put('/reset-password/', resetPassword);

module.exports = router;
