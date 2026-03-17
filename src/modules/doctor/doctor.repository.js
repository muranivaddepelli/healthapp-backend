const Doctor = require("../../models/doctor");
const Hospital = require("../../models/hospital");
const DoctorAvailability = require("../../models/doctorAvailability");
const DoctorException = require("../../models/doctorException");


exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findDoctor = (hospitalId, username) => {
  return Doctor.findOne({
    hospitalId,
    username
  });
};



exports.createAvailability = (data) => {
  return DoctorAvailability.create(data);
};

exports.getAvailability = (doctorId) => {
  return DoctorAvailability.find({ doctorId });
};

exports.deleteAvailability = (id, doctorId) => {
  return DoctorAvailability.findOneAndDelete({
    _id: id,
    doctorId
  });
};

exports.createException = (data) => {
  return DoctorException.create(data);
};

exports.getExceptions = (doctorId) => {
  return DoctorException.find({ doctorId });
};

exports.deleteException = (id, doctorId) => {
  return DoctorException.findOneAndDelete({
    _id: id,
    doctorId
  });
};