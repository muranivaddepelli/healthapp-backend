const mongoose = require("mongoose");

const LabOrderSchema = new mongoose.Schema(
  {
    patientName: String,
    age: Number,
    dob: Date,
    patientId: String,
    gender: {
  type: String,
  enum: ["Male", "Female", "Other"]
},

    testName: String,

    orderId: String,
    sampleBarcode: String,

    scheduledAt: Date,

    status: {
      type: String,
      enum: [
        "ordered",
        "sample_collected",
        "processing",
        "verified",
        "completed"
      ],
      default: "ordered"
    },

    sampleCollectedAt: Date,

    reportUrl: String,
    reportType: {
      type: String,
      enum: ["pdf", "image"]
    },
    reportGeneratedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabOrder", LabOrderSchema);