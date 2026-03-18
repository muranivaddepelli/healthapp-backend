const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["consultation", "diagnostic"],
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
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

  price: Number,

  mode: {
    type: String,
    enum: ["home", "walk-in"]
  },

  quantity: {
    type: Number,
    default: 1
  },

  modeOfPayment: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },

  status: {
    type: String,
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);