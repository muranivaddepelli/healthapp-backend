
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  age: {
    type: Number
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  profilePhoto: {
    type: String
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    default: "patient"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);