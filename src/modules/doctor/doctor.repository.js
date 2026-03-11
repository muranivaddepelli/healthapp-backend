const Doctor = require("../../models/doctor");
const Hospital = require("../../models/hospital");

exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findDoctor = (hospitalId, username) => {
  return Doctor.findOne({
    hospitalId,
    username
  });
};