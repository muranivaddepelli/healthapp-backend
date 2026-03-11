const bcrypt = require("bcryptjs");
const repo = require("./admin.repository");
const {generateStaffAccessToken} = require("../../utils/token");


exports.login = async (username, password) => {

  const admin = await repo.findAdmin(username);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateStaffAccessToken({
    id: admin._id,
    role: "admin"
  });

  return {
    accessToken,
    role: "admin",
    adminId: admin._id
  };

};


exports.createHospital = (data) => repo.createHospital(data);

exports.getHospitals = () => repo.getHospitals();

exports.getHospitalById = (id) => repo.getHospitalById(id);

exports.updateHospital = (id, data) => repo.updateHospital(id, data);

exports.deleteHospital = (id) => repo.deleteHospital(id);



exports.createDoctor = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return repo.createDoctor({
    ...data,
    password: hashedPassword
  });

};

exports.getDoctors = () => repo.getDoctors();

exports.getDoctorById = (id) => repo.getDoctorById(id);

exports.updateDoctor = (id, data) => repo.updateDoctor(id, data);

exports.deleteDoctor = (id) => repo.deleteDoctor(id);



exports.createFrontdesk = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return repo.createFrontdesk({
    ...data,
    password: hashedPassword
  });

};

exports.getFrontdesks = () => repo.getFrontdesks();

exports.getFrontdeskById = (id) => repo.getFrontdeskById(id);

exports.updateFrontdesk = (id, data) => repo.updateFrontdesk(id, data);

exports.deleteFrontdesk = (id) => repo.deleteFrontdesk(id);




exports.createPharmacy = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return repo.createPharmacy({
    ...data,
    password: hashedPassword
  });

};

exports.getPharmacies = () => repo.getPharmacies();

exports.getPharmacyById = (id) => repo.getPharmacyById(id);

exports.updatePharmacy = (id, data) => repo.updatePharmacy(id, data);

exports.deletePharmacy = (id) => repo.deletePharmacy(id);





exports.createLab = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return repo.createLab({
    ...data,
    password: hashedPassword
  });

};

exports.getLabs = () => repo.getLabs();

exports.getLabById = (id) => repo.getLabById(id);

exports.updateLab = (id, data) => repo.updateLab(id, data);

exports.deleteLab = (id) => repo.deleteLab(id);