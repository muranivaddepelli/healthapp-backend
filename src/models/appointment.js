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

  tokenNumber: String,

  visitType: {
    type: String,
    enum: ["consultation", "follow-up"],
    default: "consultation"
  },

  consultationFee: Number,

  modeOfPayment: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },

  status: {
    type: String,
    enum: [
      "waiting",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show"
    ],
    default: "waiting"
  },

  checkInTime: Date,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }

}, { timestamps: true });