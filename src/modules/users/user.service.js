const repo = require("./user.repository");
const Address = require("../../models/address");
const Hospital = require("../../models/hospital");
const Doctor = require("../../models/doctor");
const DoctorException = require("../../models/doctorException");
const DoctorAvailability = require("../../models/doctorAvailability");
const Cart = require("../../models/cart");
const Appointment = require("../../models/appointment");
const TestSlot = require("../../models/testSlot");
const DiagnosticTest = require("../../models/diagnosticTest");
const Medicine = require("../../models/medicine");
const PharmacyCart = require("../../models/pharmacyCart");
const PharmacyOrder = require("../../models/pharmacyOrder");
const Review = require("../../models/review");
const DiagnosticOrder = require("../../models/diagnosticOrder");
const Prescription = require("../../models/prescription");
const DoctorEvent = require("../../models/doctorEvent");
const LabOrder = require("../../models/LabOrder");
const User = require("../../models/user");
const { generatePatientId } = require("../../utils/generatePatientId");



exports.getProfile = async (userId) => {
  return repo.getProfile(userId);
};

exports.updateProfile = async (userId, data) => {
  return repo.updateProfile(userId, data);
};



exports.getNearbyHospitals = async (addressId) => {

  const address = await Address.findById(addressId);

  if (!address) {
    throw new Error("Address not found");
  }

  const hospitals = await Hospital.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            address.longitude,
            address.latitude
          ]
        },
        distanceField: "distance",
        maxDistance: 10000,
        spherical: true
      }
    }
  ]);

  return hospitals.map(h => ({
    ...h,
    distanceKm: (h.distance / 1000).toFixed(2)
  }));

};
exports.getDoctors = async (specialization, location, type) => {

  const query = {};

  if (specialization) {
    query.specialization = specialization;
  }

  if (location && type === "clinic") {
    query.clinicLocation = { $in: location };
  }

  if (location && type === "home") {
    query.availabilityLocation = { $in: location };
  }

  const doctors = await Doctor.find(query)
    .select("-password -__v -createdAt -updatedAt")
    .populate("hospitalId", "hospitalName address");

  return doctors.map(d => ({
    doctorId: d._id,
    doctorName: d.username,
    specialization: d.specialization,
    experience: d.experience,
    education: d.education,
    profileImage: d.profileImage,

    location: type === "home"
      ? d.availabilityLocation
      : d.clinicLocation,

    hospitalName: d.hospitalId?.hospitalName,
    hospitalAddress: d.hospitalId?.address,
    servicesOffered: d.servicesOffered
  }));
};

exports.getDoctorDetails = async (doctorId) => {

  const doctor = await Doctor.findById(doctorId)
    .select("-password -__v -createdAt -updatedAt")
    .populate("hospitalId", "hospitalName address");

  if (!doctor) {
    throw new Error("Doctor not found");
  }
  return {
    doctorId: doctor._id,
    doctorName: doctor.username,
    specialization: doctor.specialization,
    experience: doctor.experience,
    education: doctor.education,
    about: doctor.about,
    profileImage: doctor.profileImage,
    clinicLocation: doctor.clinicLocation,
    hospitalName: doctor.hospitalId?.hospitalName,
    hospitalAddress: doctor.hospitalId?.address,
    servicesOffered: doctor.servicesOffered,
    availabilityLocation: doctor.availabilityLocation,
    consultationFee: doctor.consultationFee
  };
};

exports.getDoctorSlots = async (doctorId, date) => {

  const selectedDate = new Date(date + "T00:00:00.000Z");

  const day = selectedDate.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const exception = await DoctorException.findOne({
    doctorId,
    fromDate: { $lte: selectedDate },
    toDate: { $gte: selectedDate }
  });

  if (exception && exception.isFullDay) {
    return [];
  }

  const availability = await DoctorAvailability.find({
    doctorId,
    day
  });

  let slots = [];

  availability.forEach(a => {
    (a.slots || []).forEach(slot => {

      let start = new Date(`1970-01-01T${slot.startTime}:00`);
      let end = new Date(`1970-01-01T${slot.endTime}:00`);

      while (start < end) {
        const time = start.toTimeString().slice(0, 5);
        slots.push(time);
        start.setMinutes(start.getMinutes() + 30);
      }

    });
  });

  if (exception && !exception.isFullDay) {
    slots = slots.filter(time =>
      !(time >= exception.startTime && time < exception.endTime)
    );
  }

  const booked = await Appointment.find({
    doctorId,
    date: selectedDate,
    status: { $ne: "cancelled" }
  });

  const bookedTimes = booked.map(b => b.time);

  slots = slots.filter(time => !bookedTimes.includes(time));

  const events = await DoctorEvent.find({
    doctorId,
    date: selectedDate
  });

  events.forEach(e => {
    slots = slots.filter(time =>
      !(time >= e.startTime && time < e.endTime)
    );
  });
  slots = [...new Set(slots)];
  slots.sort();

  return slots;
};

exports.addToCart = async (userId, data) => {

  const { type } = data;

  if (type === "consultation") {

    const { doctorId, date, time } = data;

    const doctor = await Doctor.findById(doctorId).populate("hospitalId");

    if (!doctor) throw new Error("Doctor not found");

    const existing = await Cart.findOne({
      userId,
      doctorId,
      date,
      time,
      status: "active"
    });

    if (existing) {
      throw new Error("Slot already in cart");
    }

    return Cart.create({
      userId,
      type: "consultation",
      doctorId,
      hospitalId: doctor.hospitalId,
      date,
      time,
      price: doctor.consultationFee
    });
  }

if (type === "diagnostic") {

  const { testId, slotId, date, time, mode } = data;

  if (!mode || !["home", "walk-in"].includes(mode)) {
    throw new Error("Invalid or missing mode");
  }

  const slot = await TestSlot.findById(slotId);

  if (!slot || slot.isBooked) {
    throw new Error("Slot not available");
  }

  if (slot.mode !== mode) {
    throw new Error("Selected slot does not match mode");
  }

  const userData = await repo.getProfile(userId);

  const test = await DiagnosticTest.findById(testId);

  if (!test) {
    throw new Error("Test not found");
  }

  const existing = await LabOrder.findOne({
    patientName: userData.name,
    dob: userData.dob
  });

  let patientId;

  if (existing) {
    patientId = existing.patientId;
  } else {
    patientId = generatePatientId();
  }

  const labOrder = await LabOrder.create({
    patientName: userData.name,
    age: userData.age,
    gender: userData.gender,
    dob: userData.dob,
    patientId,
    testName: test.name,
    orderId: "ORD-" + Date.now(),
    scheduledAt: date,
    status: "ordered"
  });

  const order = await DiagnosticOrder.create({
    userId,
    testId,
    slotId,
    date,
    time,
    mode
  });

  slot.isBooked = true;
  await slot.save();

  return {
    type: "diagnostic",
    data: order,
    labOrderId: labOrder._id
  };
}
  throw new Error("Invalid cart type");
};



exports.getCart = async (userId) => {
  const carts = await Cart.find({ userId, status: "active" })
    .populate("doctorId", "username specialization profileImage")
    .populate("hospitalId", "hospitalName")
    .populate("testId", "name price")
    .populate("slotId", "time date");

  return carts.map(item => {

    if (item.type === "consultation") {
      return {
        cartId: item._id,
        type: "consultation",
        doctorName: item.doctorId?.username,
        specialization: item.doctorId?.specialization,
        hospitalName: item.hospitalId?.hospitalName,
        fee: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        date: item.date,
        time: item.time
      };
    }

    if (item.type === "diagnostic") {
      return {
        cartId: item._id,
        type: "diagnostic",
        testName: item.testId?.name,
        price: item.price,
        mode: item.mode,
        date: item.date,
        time: item.time
      };
    }

  });
};
exports.updateQuantity = async (userId, cartId, quantity) => {

  if (quantity < 1) throw new Error("Invalid quantity");

  return Cart.findOneAndUpdate(
    { _id: cartId, userId },
    { quantity },
    { new: true }
  );
};
exports.deleteCart = async (userId, cartId) => {

  return Cart.findOneAndDelete({
    _id: cartId,
    userId
  });
};
exports.checkout = async (userId, data) => {

  const { modeOfPayment } = data || {};

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const cartItems = await Cart.find({ userId, status: "active" });

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  const results = [];

  for (let item of cartItems) {

    //CONSULTATION
    if (item.type === "consultation") {

      const exists = await Appointment.findOne({
        doctorId: item.doctorId,
        date: item.date,
        time: item.time
      });

      if (exists) {
        throw new Error("Slot already booked");
      }

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

const count = await Appointment.countDocuments({
  date: { $gte: todayStart, $lte: todayEnd }
});

const tokenNumber = `T-${100 + count + 1}`;

const appointment = await Appointment.create({
  userId,
  doctorId: item.doctorId,
  hospitalId: item.hospitalId,
  date: item.date,
  time: item.time,
  consultationFee: item.price,
  modeOfPayment: modeOfPayment || "offline",
  paymentStatus: "pending",
  tokenNumber,
  status: "waiting"
});      results.push({
        type: "consultation",
        data: appointment
      });
    }

    //DIAGNOSTIC
    if (item.type === "diagnostic") {

      const slot = await TestSlot.findById(item.slotId);

      if (!slot || slot.isBooked) {
        throw new Error("Slot not available");
      }

      const test = await DiagnosticTest.findById(item.testId);
      if (!test) {
        throw new Error("Diagnostic test not found");
      }

      const patientName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      const existingQuery = { patientName };
      if (user.dob) {
        existingQuery.dob = user.dob;
      }

      const existing = await LabOrder.findOne(existingQuery);

      let patientId;

      if (existing) {
        patientId = existing.patientId;
      } else {
        patientId = generatePatientId();
      }

      const labOrder = await LabOrder.create({
        patientName,
        age: user.age,
        gender: user.gender,
        dob: user.dob,

        patientId,

        testName: test.name,
        orderId: "ORD-" + Date.now(),

        scheduledAt: item.date,
        status: "ordered"
      });

      slot.isBooked = true;
      await slot.save();

      results.push({
        type: "diagnostic",
        data: labOrder
      });
    }

    item.status = "paid";
    await item.save();
  }

  return results;
};
exports.getMedicines = async (search) => {
  return Medicine.find({
    name: { $regex: search, $options: "i" },
    stock: { $gt: 0 }
  });
};
exports.addPharmacyCart = async (userId, data) => {

  const { medicineId, quantity } = data;

  const medicine = await Medicine.findById(medicineId);

  if (!medicine || medicine.stock < quantity) {
    throw new Error("Out of stock");
  }

  return PharmacyCart.create({
    userId,
    medicineId,
    quantity,
    price: medicine.price
  });
};
exports.getPharmacyCart = async (userId) => {
  return PharmacyCart.find({ userId, status: "active" })
    .populate("medicineId");
};
exports.checkoutPharmacy = async (userId, paymentMethod) => {

  const cartItems = await PharmacyCart.find({
    userId,
    status: "active"
  }).populate("medicineId");

  let total = 0;

  const items = cartItems.map(i => {
    total += i.price * i.quantity;

    return {
      medicineId: i.medicineId._id,
      quantity: i.quantity,
      price: i.price
    };
  });

  const order = await PharmacyOrder.create({
    userId,
    items,
    totalAmount: total,
    paymentMethod
  });

  for (let item of cartItems) {

    await Medicine.findByIdAndUpdate(item.medicineId._id, {
      $inc: { stock: -item.quantity }
    });

    item.status = "ordered";
    await item.save();
  }

  return order;
};
exports.addReview = async (userId, data) => {

  const { medicineId, rating, comment } = data;

  await Review.create({
    userId,
    medicineId,
    rating,
    comment
  });

  const reviews = await Review.find({ medicineId });

  const avg =
    reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

  await Medicine.findByIdAndUpdate(medicineId, {
    rating: avg,
    reviewCount: reviews.length
  });
};

exports.uploadPrescription = async (userId, file, publicId, filename, notes) => {

  return Prescription.create({
    userId,
    file,
    publicId,
    filename,
    notes
  });
};


exports.importFromEMR = async (userId, emrId) => {

  const res = await axios.get(
    `http://localhost:5000/api/emr/prescriptions/${emrId}`
  );

  const emrData = res.data.data;

  const prescription = await Prescription.create({
    userId,
    file: emrData.fileUrl,
    type: "emr",
    status: "pending"
  });

  return prescription;
};
