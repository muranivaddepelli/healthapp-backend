
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lab"
  },

  name: String,
  description: String,
  price: Number,

  type: {
    type: String,
    enum: ["home", "walk-in", "both"],
    default: "both"
  },
    image: String   


}, { timestamps: true });

module.exports = mongoose.model("DiagnosticTest", schema);