const service = require("./emr.service");

exports.getPrescription = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.getPrescription(id);

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


exports.getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    const data = await service.getReports(userId, type);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPharmacyBills = async (req, res) => {
  try {

    const userId = req.user.id;

    const data = await service.getPharmacyBills(userId);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};