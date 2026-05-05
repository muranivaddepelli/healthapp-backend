const Lab = require("../../models/lab");
const Hospital = require("../../models/hospital");
const DiagnosticTest = require("../../models/diagnosticTest");
const LabOrder = require("../../models/LabOrder");

exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findHospitalById = async (hospitalId) => {
  return await Hospital.findById(hospitalId);
};

exports.findLab = async (hospitalId, username) => {
  return await Lab.findOne({
    hospitalId: new mongoose.Types.ObjectId(hospitalId),
    name: { $regex: `^${username.trim()}$`, $options: "i" }
  });
};
exports.findLab = (hospitalId, username) => {
  return Lab.findOne({
    hospitalId,
    username
  });
};

exports.createTest = (data) => {
  return DiagnosticTest.create(data);
};

exports.getOrders = (filter) => {
  return LabOrder.find(filter).sort({ createdAt: -1 });
};

exports.updateOrder = (orderId, updateData) => {
  return LabOrder.findByIdAndUpdate(orderId, updateData, {
    new: true
  });
};


exports.getStatsByDate = async (date) => {
  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(date.setHours(23, 59, 59, 999));

  const total = await LabOrder.countDocuments({
    createdAt: { $gte: start, $lte: end }
  });

  const pending = await LabOrder.countDocuments({
    status: "ordered",
    createdAt: { $gte: start, $lte: end }
  });

  const processing = await LabOrder.countDocuments({
    status: "processing",
    createdAt: { $gte: start, $lte: end }
  });

  const completed = await LabOrder.countDocuments({
    status: "completed",
    createdAt: { $gte: start, $lte: end }
  });

  return { total, pending, processing, completed };
};

exports.getOrderById = (id) => {
  return LabOrder.findById(id);
};


exports.getPatients = async (search) => {
  let matchStage = { $match: {} };

  if (search) {
    const trimmed = search.trim();

    matchStage = {
      $match: {
        $or: [
          { patientName: { $regex: trimmed, $options: "i" } },

          { patientId: { $regex: trimmed, $options: "i" } }
        ]
      }
    };
  }

  return LabOrder.aggregate([
    matchStage,

    {
      $group: {
        _id: "$patientId",

        patientName: { $first: "$patientName" },
        age: { $first: "$age" },
        gender: { $first: "$gender" },

        lastTestDate: { $max: "$createdAt" },

        activeTestsCount: {
          $sum: {
            $cond: [
              { $ne: ["$status", "completed"] },
              1,
              0
            ]
          }
        }
      }
    },

    {
      $project: {
        _id: 0,
        patientId: "$_id",
        patientName: 1,
        age: 1,
        gender: 1,
        lastTestDate: 1,
        activeTestsCount: 1
      }
    },

    {
      $sort: { lastTestDate: -1 }
    }
  ]);
};




exports.getPatientReports = async (patientId) => {

  const reports = await LabOrder.find({
    patientId,
    status: "completed"
  })
  .select("testName reportUrl reportType reportGeneratedAt orderId")
  .sort({ reportGeneratedAt: -1 });

  return {
    pdfReports: reports.filter(r => r.reportType === "pdf"),
    imageReports: reports.filter(r => r.reportType === "image"),
    bills: [] 
  };
};