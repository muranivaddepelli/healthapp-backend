const Frontdesk = require("../../models/frontdesk");
const Hospital = require("../../models/hospital");

exports.findHospitalByName = (hospitalName) => {
  return Hospital.findOne({ hospitalName });
};

exports.findFrontdesk = (hospitalId, username) => {
  return Frontdesk.findOne({
    hospitalId,
    username
  });
};