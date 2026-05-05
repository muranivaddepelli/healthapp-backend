const mongoose = require("mongoose");

const diagnosticOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  phlebotomistId: {   
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phlebotomist",  
    required: true
  },

  tests: [
    {
      testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiagnosticTest"
      },
      name: String,
      price: Number
    }
  ],

  totalAmount: Number,

  date: Date,
  time: String,

  mode: {
    type: String,
    enum: ["home", "walk-in"]
  },

  status: {
    type: String,
    enum: [
      "confirmed",
      "waiting",
      "in-progress",
      "completed",
      "cancelled"
    ],
    default: "confirmed"
  },

  tokenNumber: String,

  checkedInAt: Date,
  inProgressAt: Date,
  completedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("DiagnosticOrder", diagnosticOrderSchema);