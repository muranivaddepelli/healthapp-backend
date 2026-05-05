const service = require("./lab.service");
const { logout } = require("../../utils/logout");
const DiagnosticTest = require("../../models/diagnosticTest");
const TestSlot = require("../../models/testSlot");
const path = require("path");
const fs = require("fs");
const labService = require("./lab.service");
const Lab = require("../../models/lab");
const bcrypt = require("bcrypt");


exports.createAvailability = async (req, res) => {
  try {
    const data = await service.createAvailability(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  const data = await service.getAvailability();
  res.json(data);
};

exports.login = async (req, res) => {
  try {
    const { hospitalId, name: username, password } = req.body;

    if (!hospitalId || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await service.login(hospitalId, username, password);

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
    const { testId, date, slots, mode } = req.body;
    const labId = req.user.id;

    if (!testId || !date) {
      return res.status(400).json({ message: "testId and date are required" });
    }

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Slots required" });
    }

    if (!mode || !["home", "walk-in"].includes(mode)) {
      return res.status(400).json({ message: "Invalid mode" });
    }

    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (slotDate < today) {
      return res.status(400).json({ message: "Cannot add slots for past dates" });
    }

    const test = await DiagnosticTest.findById(testId);
    if (!test || test.labId.toString() !== labId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const uniqueSlots = [...new Set(slots)];

    const is24hr = /^([01]\d|2[0-3]):[0-5]\d$/;
    const is12hr = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    const convertTo24Hour = (time) => {
      if (is24hr.test(time)) return time;

      if (is12hr.test(time)) {
        let [t, modifier] = time.split(" ");
        let [hours, minutes] = t.split(":");

        hours = parseInt(hours);

        if (modifier.toUpperCase() === "PM" && hours !== 12) {
          hours += 12;
        }
        if (modifier.toUpperCase() === "AM" && hours === 12) {
          hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      }

      return null;
    };

    const normalizedSlots = [];

    for (let time of uniqueSlots) {
      const converted = convertTo24Hour(time);

      if (!converted) {
        return res.status(400).json({ message: `Invalid time format: ${time}` });
      }

      normalizedSlots.push(converted);
    }

    const existingSlots = await TestSlot.find({
      testId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      },
      mode
    });

    const existingTimes = existingSlots.map(s => s.time);

    const newSlots = normalizedSlots.filter(time => !existingTimes.includes(time));

    if (newSlots.length === 0) {
      return res.status(400).json({ message: "All slots already exist" });
    }

    const slotData = newSlots.map(time => ({
      testId,
      date,
      time, 
      mode,
      isBooked: false
    }));

    const created = await TestSlot.insertMany(slotData);

    res.json({
      success: true,
      message: `${created.length} slots added successfully`,
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

    const data = await service.getPatientReports(patientId);

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

exports.updateReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const filePath = `uploads/reports/${Date.now()}-${req.file.originalname}`;

    const updated = await service.updateReport(
      orderId,
      filePath,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: "Report updated",
      data: updated
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.viewReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await service.getOrderById(orderId);

    if (!order || !order.reportUrl) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.sendFile(path.resolve(order.reportUrl));

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await service.getOrderById(orderId);

    if (!order || !order.reportUrl) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.download(path.resolve(order.reportUrl));

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLabAvailability = async (req, res) => {
  try {
    const { technicianId, day, slots } = req.body;

    const availability = await LabAvailability.create({
      technicianId,
      day,
      slots
    });

    res.json({
      success: true,
      data: availability
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.logout = logout;