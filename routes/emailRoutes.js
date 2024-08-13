// routes/emailRoutes.js

const express = require('express');
const { sendEmail } = require('../controllers/emailController');

const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running properly.' });
});

router.post('/send', sendEmail);

module.exports = router;
