const razorpay = require('../config/razorpayConfig');

const createOrder = async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt,
      payment_capture: '1', // auto capture
      notes,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
};
