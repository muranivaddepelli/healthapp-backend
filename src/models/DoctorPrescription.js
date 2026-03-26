const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timings: [String],
  meal: String,
  duration: Number,
  type: String,
  frequency: String,
  remarks: String
});

const doctorPrescriptionSchema = new mongoose.Schema({

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  diagnosis: {
    type: String,
    required: true
  },

  vitals: {
    bp: String,
    weight: String,
    height: String,
    spo2: String
  },
  medicalHistory: {
  type: String
},

  diagnostics: {
    hba1c: String,
    ldl: String,
    vldl: String,
    triglycerides: String
  },

  medicines: [medicineSchema],

  lifestyle: {
    advice: String,
    dos: String,
    donts: String,
    smoking: String,
    drinking: String,
    workout: String
  },

  followUp: {
    days: Number,
    date: Date,
    notes: String
  },

  referral: {
    department: String,
    doctor: String,
    reason: String
  },

  complaints: String,

  visitNumber: Number,

  prescriptionId: String

}, { timestamps: true });

module.exports = mongoose.model("DoctorPrescription", doctorPrescriptionSchema);