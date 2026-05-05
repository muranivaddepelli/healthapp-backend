
const mongoose = require("mongoose");
const labSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true    
  },

  role: {
    type: String,
    default: "phlebotomist"
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Lab", labSchema); 