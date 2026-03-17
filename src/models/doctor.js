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

  specialization: {
    type: String
  },

  experience: {
    type: Number
  },

  education: {
    type: String
  },

  consultationFee: {
  type: Number,
  required: true
},

  about: {
    type: String
  },

  servicesOffered: [
    {
      type: String
    }
  ],

  clinicLocation: {
    type: String
  },

  availabilityLocation: {
    type: String
  },

  profileImage: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);