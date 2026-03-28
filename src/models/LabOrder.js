const mongoose = require("mongoose");

const LabOrderSchema = new mongoose.Schema(
  {
    patientName: String,
    testName: String,
    orderId: String,
    sampleId: String,

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

    reportUrl: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabOrder", LabOrderSchema);