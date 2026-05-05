const mongoose = require("mongoose");

const labAvailabilitySchema = new mongoose.Schema({

  phlebotomistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phlebotomist",   
    required: true
  },

  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ]
  },

  slots: [
    {
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    }
  ],

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("LabAvailability", labAvailabilitySchema);