const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_EXPIRY } = require("../constants/authConstants");
const {STAFF_ACCESS_TOKEN_EXPIRY} = require("../constants/authConstants");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY}
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

  exports.generateStaffAccessToken = (payload) => {

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: STAFF_ACCESS_TOKEN_EXPIRY }
  );

};