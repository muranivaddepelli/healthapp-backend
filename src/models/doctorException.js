const mongoose = require("mongoose");

const doctorExceptionSchema = new mongoose.Schema({

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  fromDate: {
    type: Date,
    required: true
  },

  toDate: {
    type: Date,
    required: true
  },

  isFullDay: {
    type: Boolean,
    default: true
  },

  startTime: String,
  endTime: String,

  reason: String

}, { timestamps: true });

module.exports = mongoose.model("DoctorException", doctorExceptionSchema);