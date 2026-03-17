const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({

  hospitalName: {
    type: String,
    required: true
  },

  address: String,

  // latitude: Number,

  // longitude: Number,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  
  phone: String,

  email: String,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

hospitalSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hospital", hospitalSchema);