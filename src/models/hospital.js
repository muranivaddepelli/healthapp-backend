const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({

  hospitalName: {
    type: String,
    required: true
  },

  address: String,

  phone: String,

  email: String,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Hospital", hospitalSchema);