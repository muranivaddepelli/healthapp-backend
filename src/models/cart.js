const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  date: Date,
  time: String,

  consultationFee: Number,

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