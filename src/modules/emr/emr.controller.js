const service = require("./emr.service");

exports.getPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.getPrescription(id);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getPrescriptions = async (req, res) => {
  try {
    const data = await service.getPrescriptions(req.user.id);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getReports = async (req, res) => {
  try {
    const { type } = req.query;

    const data = await service.getReports(req.user.id, type);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getPharmacyBills = async (req, res) => {
  try {
    const data = await service.getPharmacyBills(req.user.id);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllBills = async (req, res) => {
  try {
    const data = await service.getAllBills(req.user.id);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      testName,
      type, // blood or image
      date,
      description
    } = req.body;

    const file = req.file; 

    const report = await LabOrder.create({
      userId,
      testName,
      scheduledAt: date,
      reportUrl: file.path,
      reportType: file.mimetype.includes("image") ? "image" : "pdf",
      status: "completed"
    });

    res.json({
      success: true,
      data: report
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.uploadPrescription = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      doctorName,
      clinicName,
      date,
      description
    } = req.body;

    const file = req.file;

    if (!file) {
      throw new Error("File is required");
    }

    const prescription = await Prescription.create({
      userId,
      doctorName,
      clinicName,
      date,
      notes: description,
      isExternal: true, 
      prescriptionId: "RX-" + Date.now(),
      file: file.path
    });

    res.json({
      success: true,
      data: prescription
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};