const repo = require("./address.repository");
const {getCoordinates} = require("../../utils/geocode");

const formatAddress = (address) => {
  return `${address.house}, ${address.area}, ${address.locality} - ${address.pincode}`;
};


exports.addAddress = async (userId, data) => {

    data.addressType = data.addressType?.toLowerCase();


  if (data.isDefault) {
    await repo.clearDefault(userId);
  }

  if (!data.latitude || !data.longitude) {

    const addressString =
      `${data.house}, ${data.area}, ${data.locality}, ${data.pincode}, India`;

    const coords = await getCoordinates(addressString);

    data.latitude = coords.latitude;
    data.longitude = coords.longitude;
  }

  const address = await repo.createAddress({
    ...data,
    userId
  });

  return {
    ...address.toObject(),
    fullAddress: formatAddress(address)
  };
};


exports.getAddresses = async (userId, search) => {

  const addresses = await repo.getAddresses(userId, search);

  return addresses.map(a => ({
    ...a.toObject(),
    fullAddress: formatAddress(a)
  }));
};

exports.getAddress = async (userId, id) => {

  const address = await repo.getAddressById(userId, id);

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...address.toObject(),
    fullAddress: formatAddress(address)
  };
};

exports.updateAddress = async (userId, id, data) => {

  if (data.isDefault) {
    await repo.clearDefault(userId);
  }

  const address = await repo.updateAddress(userId, id, data);

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...address.toObject(),
    fullAddress: formatAddress(address)
  };
};

exports.deleteAddress = async (userId, id) => {

  const address = await repo.softDeleteAddress(userId, id);

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Address deleted successfully" };
};

exports.setDefaultAddress = async (userId, id) => {

  await repo.clearDefault(userId);

  const address = await repo.setDefault(userId, id);

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...address.toObject(),
    fullAddress: formatAddress(address)
  };
};