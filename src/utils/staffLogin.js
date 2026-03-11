const bcrypt = require("bcryptjs");
const Hospital = require("../models/hospital");
const { generateStaffAccessToken } = require("./token");

const staffLogin = async ({
  hospitalName,
  username,
  password,
  findStaff,
  role
}) => {

  const hospital = await Hospital.findOne({ hospitalName });

  if (!hospital) {
    const error = new Error("Hospital not found");
    error.statusCode = 404;
    throw error;
  }

  const staff = await findStaff(hospital._id, username);

  if (!staff) {
    const error = new Error(`${role} not found`);
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, staff.password);

  if (!match) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateStaffAccessToken({
    id: staff._id,
    role,
    hospitalId: hospital._id
  });

  return {
    accessToken,
    role,
    staffId: staff._id,
    hospitalId: hospital._id
  };
};

module.exports = staffLogin;