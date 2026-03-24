const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  title: String,

  date: Date,
  startTime: String,
  endTime: String,

  type: {
    type: String,
    enum: ["block", "meeting", "break"],
    default: "block"
  }

}, { timestamps: true });

module.exports = mongoose.model("DoctorEvent", schema);