// routes/privateRoute.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Access granted to protected route',
        user: req.user, // Contains the user information from the token
    });
});

module.exports = router;
