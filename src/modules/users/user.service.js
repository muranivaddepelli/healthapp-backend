const repo = require("./user.repository");

exports.getProfile = async (userId) => {
  return repo.getProfile(userId);
};

exports.updateProfile = async (userId, data) => {
  return repo.updateProfile(userId, data);
};