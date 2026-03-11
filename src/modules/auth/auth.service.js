const bcrypt = require("bcryptjs");
const repo = require("./auth.repository");
const sendOtpToEmail = require("../../utils/sendOtp");
const { BCRYPT_SALT_ROUNDS } = require("../../constants/authConstants");
const { generateAccessToken, generateRefreshToken } = require("../../utils/token");
const verifyOtpRecord = require("../../utils/verifyOtpRecord");
const verifyOtpUtil = require("../../utils/verifyOtp");

exports.signup = async (data) => {
  const existing = await repo.findUserByEmail(data.email);
if (existing) {
  const error = new Error("User already exists");
  error.statusCode = 409;
  throw error;
}
const hashed = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
  const user = await repo.createUser({
    ...data,
    password: hashed,
  });

  await sendOtpToEmail(user.email, "signup");

return { message: "OTP sent successfully" };};



exports.verifyOtp = async (email, otp) => {

  await verifyOtpUtil(email, otp, "signup");
  await repo.updateUser(email, { isVerified: true });

  await repo.softDeleteOtp(email, "signup");

  return { message: "Account verified successfully" };
};
exports.login = async (email, password) => {
  const user = await repo.findUserByEmail(email);

if (!user) {
  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
}

if (!user.isVerified) {
  const error = new Error("Please verify your email first");
  error.statusCode = 403;
  throw error;
}
  const match = await bcrypt.compare(password, user.password);

if (!match) {
  const error = new Error("Invalid password");
  error.statusCode = 401;
  throw error;
}
  const accessToken = generateAccessToken({id: user._id, role: "user"});
  const refreshToken = generateRefreshToken({id: user._id});

  await repo.deleteRefreshToken(user._id);

  await repo.saveRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken
  };
};


exports.forgotPassword = async (email) => {
  const user = await repo.findUserByEmail(email);

if (!user) {
  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
}
  await sendOtpToEmail(email, "password_reset");

return { message: "OTP sent successfully" };};



exports.resetPassword = async (email, otp, password) => {

  const record = await verifyOtpUtil(email, otp, "password_reset");

  const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  await repo.updateUser(email, { password: hashed });

  await repo.softDeleteOtp(email, "password_reset");

  return { message: "Password updated successfully" };
};


exports.resendOtp = async (email, type) => {

  const user = await repo.findUserByEmail(email);

  if (!user) {
    const error = new Error("No account found with this email");
    error.statusCode = 404;
    throw error;
  }
  

  await sendOtpToEmail(email, type);

  return { message: "OTP resent successfully" };

};


exports.verifyResetOtp = async (email, otp) => {
  await verifyOtpUtil(email, otp, "password_reset");
  return { message: "OTP verified successfully" };
};