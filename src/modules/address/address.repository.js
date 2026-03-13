const Address = require("../../models/address");

exports.createAddress = (data) => {
  return Address.create(data);
};

exports.getAddresses = (userId, search) => {

  const query = { userId, isDeleted: false };

  if (search) {
    query.$or = [
      { addressName: { $regex: search, $options: "i" } },
      { area: { $regex: search, $options: "i" } },
      { locality: { $regex: search, $options: "i" } },
      { pincode: { $regex: search, $options: "i" } }
    ];
  }

  return Address.find(query).sort({ isDefault: -1, createdAt: -1 });
};

exports.getAddressById = (userId, id) => {
  return Address.findOne({ _id: id, userId, isDeleted: false });
};

exports.updateAddress = (userId, id, data) => {
  return Address.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    data,
    { new: true }
  );
};

exports.softDeleteAddress = (userId, id) => {
  return Address.findOneAndUpdate(
    { _id: id, userId },
    { isDeleted: true },
    { new: true }
  );
};

exports.clearDefault = (userId) => {
  return Address.updateMany({ userId }, { isDefault: false });
};

exports.setDefault = (userId, id) => {
  return Address.findOneAndUpdate(
    { _id: id, userId },
    { isDefault: true },
    { new: true }
  );
};