const mongoose = require("mongoose");

const schema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  orderId: String,

  doctorName: String,
  specialization: String,

  clinicName: String,
  clinicAddress: String,

  appointmentDate: Date,
  timeSlot: String,

  consultationFee: Number,

  invoiceUrl: String,

  status: {
    type: String,
    enum: ["confirmed", "completed", "cancelled"],
    default: "confirmed"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("ConsultationOrder", schema);