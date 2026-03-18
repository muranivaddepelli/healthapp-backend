const service = require("./lab.service");
const { logout } = require("../../utils/logout");
const DiagnosticTest = require("../../models/diagnosticTest");
const TestSlot = require("../../models/testSlot");

exports.login = async (req, res) => {

  try {

    const { hospitalName, username, password } = req.body;

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



exports.addTest = async (req, res) => {
  try {
    const labId = req.user.id;

    const test = await DiagnosticTest.create({
      ...req.body,
      image: req.file?.path,
      labId
    });

    res.json({
      success: true,
      data: test
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.addSlots = async (req, res) => {
  try {
    const { testId, date, slots } = req.body;

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

exports.logout = logout;