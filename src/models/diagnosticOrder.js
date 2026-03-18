
const mongoose = require("mongoose");

const diagnosticOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiagnosticTest"
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSlot"
  },

  date: Date,
  time: String,

  mode: {
    type: String,
    enum: ["home", "walk-in"]
  },

  status: {
    type: String,
    enum: ["booked", "completed", "cancelled"],
    default: "booked"
  }

}, { timestamps: true });

module.exports = mongoose.model("DiagnosticOrder", diagnosticOrderSchema);