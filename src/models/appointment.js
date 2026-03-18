const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  date: Date,
  time: String,

  consultationFee: Number,

  modeOfPayment: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },

  status: {
  type: String,
  enum: ["booked", "checked-in", "in-progress", "completed", "cancelled"],
  default: "booked"
},

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);