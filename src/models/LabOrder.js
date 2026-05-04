const mongoose = require("mongoose");

const LabOrderSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  patientName: String,
  age: Number,
  dob: Date,
  patientId: String,

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  tests: [
    {
      testName: String,
      price: Number,
      quantity: Number
    }
  ],

  orderId: String,
  sampleBarcode: String,

  labName: String,
  labAddress: String,

  scheduledAt: Date,

  status: {
    type: String,
    enum: [
      "ordered",
      "assigned",
      "sample_collected",
      "processing",
      "completed"
    ],
    default: "ordered"
  },

  subtotal: Number,
totalAmount: Number,
timeSlot: String,

  assignedAt: Date,
  sampleCollectedAt: Date,
  processingStartedAt: Date,
  completedAt: Date,

  phlebotomist: {
    name: String,
    phone: String,
    vehicle: String,
    trackingId: String
  },

  pickupLocation: {
    lat: Number,
    lng: Number
  },

  deliveryLocation: {
    lat: Number,
    lng: Number
  },

  currentLocation: {
    lat: Number,
    lng: Number
  },

  reportUrl: String,
  reportType: {
    type: String,
    enum: ["pdf", "image"]
  },
  reportGeneratedAt: Date

},
{ timestamps: true }
);

module.exports = mongoose.model("LabOrder", LabOrderSchema);