const repo = require("./doctor.repository");
const staffLogin = require("../../utils/staffLogin");

exports.login = async (hospitalName, username, password) => {

  return staffLogin({
    hospitalName,
    username,
    password,
    findStaff: repo.findDoctor,
    role: "doctor"
  });

};