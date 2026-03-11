const bcrypt = require("bcryptjs");
const repo = require("./lab.repository");
const { generateStaffAccessToken } = require("../../utils/token");

exports.login = async (hospitalName, username, password) => {

  const hospital = await repo.findHospitalByName(hospitalName);

  if (!hospital) {
    const error = new Error("Hospital not found");
    error.statusCode = 404;
    throw error;
  }

  const lab = await repo.findLab(hospital._id, username);

  if (!lab) {
    const error = new Error("Lab not found");
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, lab.password);

  if (!match) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateStaffAccessToken({
    id: lab._id,
    role: "lab"
  });

  return {
    accessToken,
    role: "lab",
    labId: lab._id
  };

};