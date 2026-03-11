const Pharmacy = require("../../models/pharmacy");
const Hospital = require("../../models/hospital");

exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findPharmacy = (hospitalId, username) => {
  return Pharmacy.findOne({
    hospitalId,
    username
  });
};