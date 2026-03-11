const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
   type: String,
   enum: ["signup", "password_reset"]
 },
  expiresAt: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },

  otpRequests: {
    type: Number,
    default: 1
  },

  lastOtpRequest: {
    type: Date,
    default: Date.now
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, 
{ timestamps: true });


module.exports = mongoose.model("Otp", otpSchema);