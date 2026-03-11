const service = require("./admin.service");
const {logout} = require("../../utils/logout");

exports.login = async (req, res) => {

  try {

    const { username, password } = req.body;

    const data = await service.login(username, password);

    res.json(data);

  } catch (err) {

    res.status(err.statusCode || 500).json({
      message: err.message
    });

  }
};


exports.createHospital = async (req, res) => {
  try {
    console.log("createHospital API called");
    console.log(req.body);

    const data = await service.createHospital(req.body);

    console.log("hospital created:", data);

    res.json(data);
  } catch (err) {
    console.error("createHospital error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitals = async (req, res) => {
  const data = await service.getHospitals();
  res.json(data);
};

exports.getHospitalById = async (req, res) => {
  const data = await service.getHospitalById(req.params.id);
  res.json(data);
};

exports.updateHospital = async (req, res) => {
  const data = await service.updateHospital(req.params.id, req.body);
  res.json(data);
};

exports.deleteHospital = async (req, res) => {
  const data = await service.deleteHospital(req.params.id);
  res.json(data);
};


exports.createDoctor = async (req, res) => {
  try {
    const data = await service.createDoctor(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDoctors = async (req, res) => {
  const data = await service.getDoctors();
  res.json(data);
};

exports.getDoctorById = async (req, res) => {
  const data = await service.getDoctorById(req.params.id);
  res.json(data);
};

exports.updateDoctor = async (req, res) => {
  const data = await service.updateDoctor(req.params.id, req.body);
  res.json(data);
};

exports.deleteDoctor = async (req, res) => {
  const data = await service.deleteDoctor(req.params.id);
  res.json(data);
};


exports.createFrontdesk = async (req, res) => {
  try {
    const data = await service.createFrontdesk(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFrontdesks = async (req, res) => {
  const data = await service.getFrontdesks();
  res.json(data);
};

exports.getFrontdeskById = async (req, res) => {
  const data = await service.getFrontdeskById(req.params.id);
  res.json(data);
};

exports.updateFrontdesk = async (req, res) => {
  const data = await service.updateFrontdesk(req.params.id, req.body);
  res.json(data);
};

exports.deleteFrontdesk = async (req, res) => {
  const data = await service.deleteFrontdesk(req.params.id);
  res.json(data);
};



exports.createPharmacy = async (req, res) => {
  try {
    const data = await service.createPharmacy(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPharmacies = async (req, res) => {
  const data = await service.getPharmacies();
  res.json(data);
};

exports.getPharmacyById = async (req, res) => {
  const data = await service.getPharmacyById(req.params.id);
  res.json(data);
};

exports.updatePharmacy = async (req, res) => {
  const data = await service.updatePharmacy(req.params.id, req.body);
  res.json(data);
};

exports.deletePharmacy = async (req, res) => {
  const data = await service.deletePharmacy(req.params.id);
  res.json(data);
};



exports.createLab = async (req, res) => {
  try {
    const data = await service.createLab(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLabs = async (req, res) => {
  const data = await service.getLabs();
  res.json(data);
};

exports.getLabById = async (req, res) => {
  const data = await service.getLabById(req.params.id);
  res.json(data);
};

exports.updateLab = async (req, res) => {
  const data = await service.updateLab(req.params.id, req.body);
  res.json(data);
};

exports.deleteLab = async (req, res) => {
  const data = await service.deleteLab(req.params.id);
  res.json(data);
};





exports.logout = logout;