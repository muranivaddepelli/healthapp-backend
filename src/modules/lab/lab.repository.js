const Lab = require("../../models/lab");
const Hospital = require("../../models/hospital");

exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findLab = (hospitalId, username) => {
  return Lab.findOne({
    hospitalId,
    username
  });
};