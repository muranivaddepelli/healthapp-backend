
const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  doctorName: {
    type: String
  },

  clinicName: {
    type: String
  },

  date: {
    type: Date
  },

  prescriptionId: {
    type: String
  },
  doctorName: {
    type: String
  },

  clinicName: {
    type: String
  },

  date: {
    type: Date
  },

  prescriptionId: {
    type: String
  },

  file: String,
  publicId: String,
  filename: String,

  notes: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Prescription", schema);