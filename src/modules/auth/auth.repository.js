const User = require("../../models/user");
const Otp = require("../../models/otp");
const RefreshToken = require("../../models/RefreshToken");

exports.createUser = (data) => User.create(data);

exports.findUserByEmail = (email) => User.findOne({ email });

exports.saveOtp = (data) => Otp.create(data);

exports.findOtp = (email) => Otp.findOne({ email }).sort({ createdAt: -1 });

exports.findOtpByEmail = async (email, purpose) => {
  return await Otp.findOne({
    email,
    purpose,
  }).sort({ _id: -1 })
};

exports.softDeleteOtp = (email, purpose) =>
  Otp.updateMany(
    { email, purpose },
    { $set:{ isDeleted: true }}
  );

exports.updateUser = (email, data) =>
  User.findOneAndUpdate({ email }, data);


exports.saveRefreshToken = (userId, token) => {
  return RefreshToken.create({
    userId,
    token
  });
};

exports.deleteRefreshToken = (userId) => {
  return RefreshToken.deleteMany({ userId });
};

exports.increaseOtpAttempts = (email,purpose) =>
  Otp.updateOne(
    { email,purpose, isDeleted: false },
    { $inc: { attempts: 1 } }
  );

  exports.upsertOtp = (data) =>
  Otp.findOneAndUpdate(
    { email: data.email, purpose: data.purpose },
    data,
    { upsert: true, returnDocument: "after" }
  );