const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },

  rating: Number,
  comment: String

}, { timestamps: true });

module.exports = mongoose.model("Review", schema);