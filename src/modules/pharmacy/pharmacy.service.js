const bcrypt = require("bcryptjs");
const repo = require("./pharmacy.repository");
const { generateStaffAccessToken } = require("../../utils/token");
const Medicine = require("../../models/medicine");
const openfda = require("../../../services/openfda.service");
const Prescription = require("../../models/prescription");
const PharmacyCart = require("../../models/pharmacyCart");
const User = require("../../models/user");
const sendCartEmail = require("../../utils/sendCartEmail");


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


exports.getPrescriptions = async () => {

  return Prescription.find()
    .populate("userId", "username email")
    .sort({ createdAt: -1 });

};


exports.approvePrescription = async (prescriptionId, data) => {

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    throw new Error("Prescription not found");
  }

  if (prescription.status === "approved") {
    throw new Error("Already approved");
  }

  if (!data.medicines || !Array.isArray(data.medicines)) {
    throw new Error("Medicines are required");
  }

  const cartItems = [];

  for (let item of data.medicines) {

    let med = await Medicine.findById(item.medicineId);

    if (!med && item.name) {
      med = await Medicine.create({
        name: item.name,
        strength: item.strength || "",
        price: item.price || 0
      });
    }

    if (!med) throw new Error("Medicine not found");

    cartItems.push({
      userId: prescription.userId,
      medicineId: med._id,
      quantity: item.quantity,
      price: med.price,
      status: "active"
    });
  }

  await PharmacyCart.insertMany(cartItems);



const user = await User.findById(prescription.userId);

const items = [];

for (let item of cartItems) {
  const med = await Medicine.findById(item.medicineId);

  items.push({
    name: med
      ? `${med.name} ${med.dosageStrength || ""}`
      : "Medicine",
    quantity: item.quantity,
    price: item.price
  });
}

sendCartEmail(user, items);
  prescription.status = "approved";
  await prescription.save();

  return {
    message: "Prescription approved & medicines added to cart"
  };
};

exports.rejectPrescription = async (id) => {

  const prescription = await Prescription.findById(id);

  if (!prescription) throw new Error("Not found");

  prescription.status = "rejected";
  await prescription.save();

  return { message: "Prescription rejected" };
};

exports.searchMedicines = async (pharmacyId, name, strength) => {

  let query = {
    pharmacyId
  };

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (strength) {
    query.dosageStrength = { $regex: strength, $options: "i" };
  }

  return await Medicine.find(query);
};