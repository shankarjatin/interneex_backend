// controllers/emailController.js

const transporter = require('../config/nodemailerConfig');
const { validateEmailData } = require('../models/emailModel');

const sendEmail = (req, res) => {
  const { name, email, phone, college, skills, experience, location, source } = req.body;

  const validation = validateEmailData({ name, email, phone, college, skills, experience, location, source });

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const mailOptions = {
    from: 'sales@modgenics.co',
    to: 'Info@interneex.com', // Replace with the recipient's email
    subject: 'New Callback Request',
    text: `You have a new callback request from ${name}.
    Email: ${email}
    Phone: ${phone}
    College: ${college}
    Skills: ${skills.join(', ')}
    Experience: ${experience} years
    Location: ${location}
    Source: ${source}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send email.' });
    }
    res.status(200).json({ message: 'Email sent successfully.' });
  });
};

module.exports = {
  sendEmail,
};
