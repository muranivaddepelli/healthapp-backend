const User = require("../../models/user");

exports.getProfile = (userId) => {
  return User.findById(userId).select("-password -__v");
};

exports.updateProfile = (userId, data) => {
  return User.findByIdAndUpdate(
    userId,
    data,
    { new: true }
  ).select("-password");
};