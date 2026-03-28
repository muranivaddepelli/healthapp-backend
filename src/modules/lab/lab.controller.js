const service = require("./lab.service");
const { logout } = require("../../utils/logout");
const DiagnosticTest = require("../../models/diagnosticTest");
const TestSlot = require("../../models/testSlot");

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

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

exports.logout = logout;