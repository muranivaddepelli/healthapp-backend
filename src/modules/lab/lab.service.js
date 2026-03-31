const bcrypt = require("bcryptjs");
const repo = require("./lab.repository");
const { generateStaffAccessToken } = require("../../utils/token");

exports.login = async (hospitalName, username, password) => {

  const hospital = await repo.findHospitalByName(hospitalName);

  if (!hospital) {
    const error = new Error("Hospital not found");
    error.statusCode = 404;
    throw error;
  }

  const lab = await repo.findLab(hospital._id, username);

  if (!lab) {
    const error = new Error("Lab not found");
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, lab.password);

  if (!match) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateStaffAccessToken({
    id: lab._id,
    role: "lab"
  });

  return {
    accessToken,
    role: "lab",
    labId: lab._id
  };

};


exports.createTest = async (body, file, labId) => {
  const data = {
    ...body,
    image: file?.path,
    labId
  };

  return await repo.createTest(data);
};


exports.getOrders = async (status, search) => {
  let filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { orderId: { $regex: search, $options: "i" } }
    ];
  }

  return await repo.getOrders(filter);
};


const validTransitions = {
  ordered: "sample_collected",
  sample_collected: "processing",
  processing: "verified"
};

exports.updateStatus = async (orderId, nextStatus) => {
  if (!orderId || !nextStatus) {
    throw new Error("orderId and status required");
  }

  const order = await repo.getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (validTransitions[order.status] !== nextStatus) {
    throw new Error("Invalid status transition");
  }

  const updateData = { status: nextStatus };

  if (nextStatus === "sample_collected") {
    updateData.sampleBarcode = "BC-" + Date.now();
    updateData.sampleCollectedAt = new Date();
  }

  return await repo.updateOrder(orderId, updateData);
};

exports.uploadReport = async (orderId, filePath, reportType) => {
  const order = await repo.getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "verified") {
    throw new Error("Report can be uploaded only after verification");
  }

  const updateData = {
    reportUrl: filePath,
    reportType,
    reportGeneratedAt: new Date(),
    completedAt: new Date(),
    status: "completed"
  };

  return await repo.updateOrder(orderId, updateData);
};
const calculateChange = (today, yesterday) => {
  if (yesterday === 0) return "0%";

  const change = ((today - yesterday) / yesterday) * 100;

  return `${change > 0 ? "+" : ""}${change.toFixed(0)}%`;
};

exports.getDashboardStats = async () => {
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const todayStats = await repo.getStatsByDate(today);

  const yesterdayStats = await repo.getStatsByDate(yesterday);

  return {
    total: todayStats.total,
    totalChange: calculateChange(todayStats.total, yesterdayStats.total),

    pending: todayStats.pending,
    pendingChange: calculateChange(todayStats.pending, yesterdayStats.pending),

    processing: todayStats.processing,
    processingChange: calculateChange(
      todayStats.processing,
      yesterdayStats.processing
    ),

    completed: todayStats.completed,
    completedChange: calculateChange(
      todayStats.completed,
      yesterdayStats.completed
    )
  };
};


exports.getOrderById = async (id) => {
  if (!id) {
    throw new Error("Order ID required");
  }

  return await repo.getOrderById(id);
};

exports.getPatients = async (search) => {
  return await repo.getPatients(search);
};

exports.getPatientReports = async (patientId) => {
  if (!patientId) throw new Error("patientId required");

  return await repo.getPatientReports(patientId);
};

exports.updateReport = async (orderId, filePath, mimetype) => {

  const reportType = mimetype.includes("pdf") ? "pdf" : "image";

  return await repo.updateOrder(orderId, {
    reportUrl: filePath,
    reportType,
    reportGeneratedAt: new Date()
  });
};