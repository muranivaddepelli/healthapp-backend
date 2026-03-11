const bcrypt = require("bcryptjs");
const repo = require("../modules/auth/auth.repository");

const verifyOtpRecord = async (record, otp) => {

  if (!record) {
    const error = new Error("OTP not found");
    error.statusCode = 404;
    throw error;
  }

  if (record.attempts >= 5) {
    const error = new Error("Too many invalid OTP attempts. Please request a new OTP.");
    error.statusCode = 429;
    throw error;
  }


  console.log("Current Time:", Date.now());
console.log("Expires At:", new Date(record.expiresAt).getTime());
console.log("OTP Record:", record);

if (Date.now() >= record.expiresAt.getTime()) {
 const error = new Error("OTP has expired");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(otp, record.otp);

  if (!isMatch) {
    await repo.increaseOtpAttempts(record.email, record.purpose);
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

console.log("User OTP:", otp);
console.log("Stored OTP hash:", record.otp);
console.log("Created At:", record.createdAt);
console.log("Expires At:", record.expiresAt);
};

module.exports = verifyOtpRecord;