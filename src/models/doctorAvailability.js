const mongoose = require("mongoose");

const doctorAvailabilitySchema = new mongoose.Schema({

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
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

module.exports = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);