const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: String,

  type: {
    type: String,
    enum: ["blood", "image"]
  },

  fileUrl: String,

  date: Date

}, { timestamps: true });

module.exports = mongoose.model("LabReport", schema);