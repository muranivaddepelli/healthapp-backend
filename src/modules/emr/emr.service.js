const repo = require("./emr.repository");
const LabReport=require("../../models/LabReport");
const Appointment = require("../../models/appointment");
const Laborder = require("../../models/LabOrder");
const PharmacyOrder = require("../../models/pharmacyOrder");

exports.getPrescription = async (emrId) => {

  const data = await repo.getPrescriptionById(emrId);

  if (!data) {
    throw new Error("EMR record not found");
  }

  return data;
};

exports.getReports = async (userId, type) => {
  let filter = { userId };

  if (type === "blood") filter.type = "blood";
  if (type === "image") filter.type = "image";

  return await LabReport.find(filter).sort({ createdAt: -1 });
};


exports.getAllBills = async (userId) => {

  const consultations = await Appointment.find({ userId });

  const diagnostics = await LabOrder.find({ userId });

  return [
    ...consultations.map(c => ({
      type: "consultation",
      id: c._id,
      date: c.createdAt,
      amount: c.consultationFee
    })),

    ...diagnostics.map(d => ({
      type: "diagnostic",
      id: d._id,
      date: d.createdAt,
      amount: d.price || 0
    }))
  ];
};

exports.getPharmacyBills = async (userId) => {
  return await PharmacyOrder.find({ userId })
    .sort({ createdAt: -1 });
};