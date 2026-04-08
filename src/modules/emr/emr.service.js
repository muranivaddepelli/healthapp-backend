const repo = require("./emr.repository");
const Appointment = require("../../models/appointment");
const LabOrder = require("../../models/LabOrder");
const PharmacyOrder = require("../../models/pharmacyOrder");


// ✅ Get single prescription
exports.getPrescription = async (emrId) => {
  const data = await repo.getPrescriptionById(emrId);

  if (!data) {
    throw new Error("EMR record not found");
  }

  return data;
};



// ✅ LAB REPORTS (FIXED)
exports.getReports = async (userId, type) => {

  let filter = {
    userId,
    status: "completed", // ✅ important
    reportUrl: { $ne: null }
  };

  if (type === "blood") filter.reportType = "pdf";
  if (type === "image") filter.reportType = "image";

  const reports = await LabOrder.find(filter)
    .sort({ createdAt: -1 });

  return reports.map(r => ({
    id: r._id,
    title: r.testName,
    date: r.reportGeneratedAt || r.createdAt,
    fileUrl: r.reportUrl,
    type: r.reportType
  }));
};



// ✅ CONSULTATION + DIAGNOSTIC BILLS (FIXED)
exports.getAllBills = async (userId) => {

  const consultations = await Appointment.find({ userId });

  const diagnostics = await LabOrder.find({ userId });

  const data = [
    ...consultations.map(c => ({
      type: "consultation",
      invoiceId: c._id,
      date: c.createdAt,
      amount: c.consultationFee
    })),

    ...diagnostics.map(d => ({
      type: "diagnostic",
      invoiceId: d.orderId,
      date: d.createdAt,
      amount: d.price || 0
    }))
  ];

  // ✅ sort latest first
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};



// ✅ PHARMACY BILLS (FIXED FOR UI)
exports.getPharmacyBills = async (userId) => {

  const orders = await PharmacyOrder.find({ userId })
    .sort({ createdAt: -1 });

  return orders.map(o => ({
    id: o._id,
    invoiceId: `INV-${o._id.toString().slice(-6)}`,
    date: o.createdAt,
    amount: o.finalAmount,
    type: o.paymentMethod === "home"
      ? "Home Delivery"
      : "Picked up"
  }));
};