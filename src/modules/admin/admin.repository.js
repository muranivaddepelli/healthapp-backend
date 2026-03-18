const Hospital = require("../../models/hospital");
const Doctor = require("../../models/doctor");
const Frontdesk = require("../../models/frontdesk");
const Pharmacy = require("../../models/pharmacy");
const Lab = require("../../models/lab");
const Admin = require("../../models/admin");


exports.findAdmin = (username) => {
  return Admin.findOne({ username });
};

exports.createHospital = (data) => Hospital.create(data);

exports.getHospitals = () => Hospital.find();

exports.getHospitalById = (id) => Hospital.findById(id);

exports.updateHospital = (id, data) =>
  Hospital.findByIdAndUpdate(id, data, { new: true });

exports.deleteHospital = (id) =>
  Hospital.findByIdAndDelete(id);



exports.createDoctor = (data) => Doctor.create(data);

exports.getDoctors = () => Doctor.find();

exports.getDoctorById = (id) => Doctor.findById(id);

exports.updateDoctor = (id, data) =>
  Doctor.findByIdAndUpdate(id, data, { new: true });

exports.deleteDoctor = (id) =>
  Doctor.findByIdAndDelete(id);



exports.createFrontdesk = (data) => Frontdesk.create(data);

exports.getFrontdesks = () => Frontdesk.find();

exports.getFrontdeskById = (id) => Frontdesk.findById(id);

exports.updateFrontdesk = (id, data) =>
  Frontdesk.findByIdAndUpdate(id, data, { new: true });

exports.deleteFrontdesk = (id) =>
  Frontdesk.findByIdAndDelete(id);



exports.createPharmacy = (data) => Pharmacy.create(data);

exports.getPharmacies = () => Pharmacy.find();

exports.getPharmacyById = (id) => Pharmacy.findById(id);

exports.updatePharmacy = (id, data) =>
  Pharmacy.findByIdAndUpdate(id, data, { new: true });

exports.deletePharmacy = (id) =>
  Pharmacy.findByIdAndDelete(id);



exports.createLab = (data) => Lab.create(data);

exports.getLabs = () => Lab.find();

exports.getLabById = (id) => Lab.findById(id);

exports.updateLab = (id, data) =>
  Lab.findByIdAndUpdate(id, data, { new: true });

exports.deleteLab = (id) =>
  Lab.findByIdAndDelete(id);