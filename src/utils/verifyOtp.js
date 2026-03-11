const repo = require("../modules/auth/auth.repository");
const verifyOtpRecord = require("./verifyOtpRecord");

const verifyOtp = async (email, otp, type) => {

  const record = await repo.findOtpByEmail(email, type);

  await verifyOtpRecord(record, otp);

  return record;

};

module.exports = verifyOtp;