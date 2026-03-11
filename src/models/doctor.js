const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },


  specialization: String,

  experience: Number,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);