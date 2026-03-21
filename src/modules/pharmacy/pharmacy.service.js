const bcrypt = require("bcryptjs");
const repo = require("./pharmacy.repository");
const { generateStaffAccessToken } = require("../../utils/token");
const Medicine = require("../../models/medicine");
const openfda = require("../../../services/openfda.service");


exports.login = async (hospitalName, username, password) => {

  const hospital = await repo.findHospitalByName(hospitalName);

  if (!hospital) {
    const error = new Error("Hospital not found");
    error.statusCode = 404;
    throw error;
  }

  const pharmacy = await repo.findPharmacy(hospital._id, username);

  if (!pharmacy) {
    const error = new Error("Pharmacy not found");
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, pharmacy.password);

  if (!match) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateStaffAccessToken({
    id: pharmacy._id,
    role: "pharmacy"
  });

  return {
    accessToken,
    role: "pharmacy",
    pharmacyId: pharmacy._id
  };

};





exports.searchOpenFDA = async (search) => {
  return openfda.search(search);
};

exports.addMedicine = async (pharmacyId, data) => {

  return Medicine.create({
    ...data,
    pharmacyId
  });
};

exports.updateMedicine = async (id, pharmacyId, data) => {

  return Medicine.findOneAndUpdate(
    { _id: id, pharmacyId },
    data,
    { new: true }
  );
};

exports.getMyMedicines = async (pharmacyId) => {
  return Medicine.find({ pharmacyId });
};