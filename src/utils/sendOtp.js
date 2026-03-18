const bcrypt = require("bcryptjs");
const generateOtp = require("./generateOtp");
const sendEmail = require("./sendEmail");
const repo = require("../modules/auth/auth.repository");
const { OTP_EXPIRY_TIME, BCRYPT_SALT_ROUNDS } = require("../constants/authConstants");

const sendOtpToEmail = async (email, purpose) => {

  const otp = generateOtp();
  console.log("Generated OTP:", otp);

  const hashedOtp = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);

  const saved = await repo.upsertOtp({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_TIME),
    lastOtpRequest: Date.now()
  });

  console.log("Saved OTP ID:", saved._id);

  await sendEmail(email, otp);
};
module.exports = sendOtpToEmail;
