const razorpay = require('../config/razorpayConfig');
const User = require('../models/User'); // Assuming the User model is in the models folder

const createOrder = async (req, res) => {
  console.log("body", req.body);
  const { amount, currency, receipt, notes } = req.body;
  const userEmail = notes.customer_email;

  try {
    const options = {
      amount, // amount is already in the smallest currency unit (paise)
      currency,
      receipt,
      payment_capture: '1', // auto capture
      notes,
    };

    const order = await razorpay.orders.create(options);

    // Update the user schema when order is successfully created, find by email
    await User.findOneAndUpdate(
      { email: userEmail },
      {
        hasPurchasedCourse: true,
        courseDetails: {
          courseName: notes.plan_name,
          courseDuration: notes.plan_duration,
          purchaseDate: new Date(),
          receiptId: receipt,
        },
      }
    );

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
};
