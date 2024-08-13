// models/emailModel.js

const validateEmailData = (data) => {
    const { name, email, phone } = data;
  
    if (!name || !email || !phone) {
      return { valid: false, message: 'All fields are required.' };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email address.' };
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: 'Phone number must be 10 digits.' };
    }
  
    return { valid: true };
  };
  
  module.exports = {
    validateEmailData,
  };
  