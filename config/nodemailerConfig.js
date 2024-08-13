// config/nodemailerConfig.js

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'hotmail', // replace with your email provider
    auth: {
        user: 'sales@modgenics.co', // replace with your email
        pass: "Modgenics@8340", // replace with your email password
    },
});

module.exports = transporter;
