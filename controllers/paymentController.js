const razorpay = require('../config/razorpayConfig');
const User = require('../models/User'); // Assuming the User model is in the models folder

const createOrder = async (req, res) => {
  console.log("body", req.body);
  const { amount, currency, receipt, notes } = req.body;

  try {
    const options = {
      amount, // amount is already in the smallest currency unit (paise)
      currency,
      receipt,
      payment_capture: '1', // auto capture
      notes,
    };

    // Create the order with Razorpay
    const order = await razorpay.orders.create(options);

    // Send the order details back to the frontend
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { orderId, paymentId, notes } = req.body;
  const userEmail = notes.customer_email;

  try {
    // Fetch the payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    // Verify if the payment is captured and belongs to the correct order
    if (payment.status === "captured" && payment.order_id === orderId) {
      // Payment captured, update the user information
      await User.findOneAndUpdate(
        { email: userEmail },
        {
          hasPurchasedCourse: true,
          courseDetails: {
            courseName: notes.plan_name,
            courseDuration: notes.plan_duration,
            purchaseDate: new Date(),
            receiptId: paymentId, // Use paymentId for the receipt reference
          },
        }
      );

      res.status(200).json({ payment, message: 'Payment successful and user updated' });
    } else {
      res.status(400).json({ message: 'Payment not successful, user not updated' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createOrder,
  verifyPayment
};
