
const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,
  paymentMethod: String,

  status: {
    type: String,
    enum: ["placed", "packed", "shipped", "delivered"],
    default: "placed"
  }

}, { timestamps: true });

module.exports = mongoose.model("PharmacyOrder", schema);