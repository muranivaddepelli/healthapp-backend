
const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  name: String,
  genericName: String,
  dosage: String,
  usage: String,
  manufacturer: String,

  dosageStrength: String,   
  packSize: String,         

  image: String,

  price: Number,
  stock: Number,

  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy"
  }

}, { timestamps: true });

module.exports = mongoose.model("Medicine", schema);