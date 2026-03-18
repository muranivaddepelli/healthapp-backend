
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiagnosticTest"
  },

  date: Date,
  time: String,

  isBooked: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("TestSlot", schema);