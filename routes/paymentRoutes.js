const express = require('express');
const { createOrder } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth')
const router = express.Router();

router.post('/create-order', createOrder);

module.exports = router;
