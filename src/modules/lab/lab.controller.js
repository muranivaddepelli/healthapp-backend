const service = require("./lab.service");
const { logout } = require("../../utils/logout");
const DiagnosticTest = require("../../models/diagnosticTest");
const TestSlot = require("../../models/testSlot");
const path = require("path");
const fs = require("fs");

exports.login = async (req, res) => {

  try {

    const { hospitalName, username, password } = req.body;
    if (!hospitalName || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await service.login(
      hospitalName,
      username,
      password
    );

    res.json(data);

  } catch (err) {

    res.status(err.statusCode || 500).json({
      message: err.message
    });

  }

};



exports.createTest = async (req, res) => {
  try {
    const labId = req.user.id;

    const test = await labService.createTest(req.body, req.file, labId);

    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.addSlots = async (req, res) => {
  try {
    const { testId, date, slots } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Slots required" });
    }
    const data = slots.map(time => ({
      testId,
      date,
      time
    }));

    const created = await TestSlot.insertMany(data);

    res.json({
      success: true,
      data: created
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    const orders = await service.getOrders(status, search);

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updated = await service.updateStatus(orderId, status);

    res.json({
      success: true,
      message: "Status updated",
      data: updated
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


exports.uploadReport = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const fileName = Date.now() + "-" + req.file.originalname;

    const uploadPath = path.join(
      __dirname,
      "../../../uploads/reports",
      fileName
    );

    fs.writeFileSync(uploadPath, req.file.buffer);

    const reportType = req.file.mimetype.includes("pdf")
      ? "pdf"
      : "image";

    const updated = await service.uploadReport(
      orderId,
      `uploads/reports/${fileName}`, 
      reportType
    );

    res.json({
      success: true,
      message: "Report uploaded & completed",
      data: updated
    });

  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large (max 10MB)"
      });
    }

    res.status(400).json({
      message: err.message
    });
  }
};

exports.previewReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await service.getOrderById(orderId);

    if (!order || !order.reportUrl) {
      return res.status(404).json({
        message: "Report not found"
      });
    }

    const filePath = path.resolve(order.reportUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    if (order.reportType === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
    } else {
      res.setHeader("Content-Type", "image/jpeg");
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await service.getDashboardStats();

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await service.getOrderById(id);

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;

    const patients = await service.getPatients(search);

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type } = req.query; 
    const data = await service.getPatientReports(patientId, type);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.logout = logout;