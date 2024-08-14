// models/emailModel.js

const validateEmailData = (data) => {
  const { name, email, phone, college, skills, experience, location, source } = data;

  if (!name || !email || !phone || !college || !skills || !experience || !location || !source) {
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

  if (skills.length === 0) {
    return { valid: false, message: 'At least one skill is required.' };
  }

  if (isNaN(experience) || experience < 0) {
    return { valid: false, message: 'Experience must be a valid number and not negative.' };
  }

  return { valid: true };
};

module.exports = {
  validateEmailData,
};
