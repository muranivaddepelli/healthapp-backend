
const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },

  quantity: { type: Number, default: 1 },
  price: Number,

  status: { type: String, default: "active" }

}, { timestamps: true });

module.exports = mongoose.model("PharmacyCart", schema);