// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    hasPurchasedCourse: { type: Boolean, default: false },
    courseDetails: { 
      type: {
        courseName: String,
        courseDuration: String,
        purchaseDate: Date,
        receiptId: String
      }, 
      default: null 
    },
    resetPasswordToken:{ type: String},
    resetPasswordExpires: {type: Date},
  });

// Encrypt the password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user-entered password to hashed password in the database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set the expiry date (e.g., 1 hour)
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
