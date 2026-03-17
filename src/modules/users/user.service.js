const repo = require("./user.repository");
const Address = require("../../models/address");
const Hospital = require("../../models/hospital");
const Doctor = require("../../models/doctor");
const DoctorException = require("../../models/doctorException");
const DoctorAvailability = require("../../models/doctorAvailability");
const Cart = require("../../models/cart");
const Appointment = require("../../models/appointment");




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



exports.getDoctors = async (specialization, location) => {

  const query = {};

  if (specialization) {
    query.specialization = specialization;
  }

  if (location) {
    query.clinicLocation = location;
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
  clinicLocation: d.clinicLocation,
  hospitalName: d.hospitalId?.hospitalName,
  hospitalAddress: d.hospitalId?.address,
  servicesOffered: d.servicesOffered
}));
};




// 🔹 1️⃣ Get Doctor Details
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






// 🔹 2️⃣ Get Doctor Slots
exports.getDoctorSlots = async (doctorId, date) => {

  const selectedDate = new Date(date + "T00:00:00.000Z");

  const day = selectedDate.toLocaleDateString("en-US", {
    weekday: "long"
  });

  console.log("Selected Date:", selectedDate);
  console.log("Day:", day);

  const exception = await DoctorException.findOne({
    doctorId,
    fromDate: { $lte: selectedDate },
    toDate: { $gte: selectedDate }
  });

  console.log("Exception:", exception);

  if (exception && exception.isFullDay) {
    return [];
  }

  const availability = await DoctorAvailability.find({
    doctorId,
    day
  });

  console.log("Availability:", availability);

  let slots = [];

  availability.forEach(a => {

    let start = new Date(`1970-01-01T${a.startTime}:00`);
    let end = new Date(`1970-01-01T${a.endTime}:00`);

    while (start < end) {

      const time = start.toTimeString().slice(0, 5);
      slots.push(time);

      start.setMinutes(start.getMinutes() + 30);
    }

  });

  if (exception && !exception.isFullDay) {

    slots = slots.filter(time =>
      time >= exception.startTime &&
      time < exception.endTime
    );
  }

  return slots;
};





// ✅ ADD TO CART
exports.addToCart = async (userId, data) => {

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
    doctorId,
    hospitalId: doctor.hospitalId,
    date,
    time,
    consultationFee: doctor.consultationFee
  });
};


// ✅ GET CART
exports.getCart = async (userId) => {

  const carts = await Cart.find({ userId, status: "active" })
    .populate("doctorId", "username specialization profileImage")
    .populate("hospitalId", "hospitalName");

  return carts.map(item => ({
    cartId: item._id,
    doctorName: item.doctorId.username,
    specialization: item.doctorId.specialization,
    profileImage: item.doctorId.profileImage,
    hospitalName: item.hospitalId.hospitalName,
    fee: item.consultationFee,
    quantity: item.quantity,
    total: item.consultationFee * item.quantity,
    date: item.date,
    time: item.time,
    modeOfPayment: item.modeOfPayment
  }));
};


// ✅ UPDATE QUANTITY
exports.updateQuantity = async (userId, cartId, quantity) => {

  if (quantity < 1) throw new Error("Invalid quantity");

  return Cart.findOneAndUpdate(
    { _id: cartId, userId },
    { quantity },
    { new: true }
  );
};


// ✅ DELETE CART
exports.deleteCart = async (userId, cartId) => {

  return Cart.findOneAndDelete({
    _id: cartId,
    userId
  });
};


// ✅ CHECKOUT (OFFLINE)
exports.checkout = async (userId, data) => {

  const { modeOfPayment } = data;

  const cartItems = await Cart.find({ userId, status: "active" });

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  const appointments = [];

  for (let item of cartItems) {

    // 🔥 Prevent double booking
    const exists = await Appointment.findOne({
      doctorId: item.doctorId,
      date: item.date,
      time: item.time
    });

    if (exists) {
      throw new Error("Slot already booked");
    }

    const appointment = await Appointment.create({
      userId,
      doctorId: item.doctorId,
      hospitalId: item.hospitalId,
      date: item.date,
      time: item.time,
      consultationFee: item.consultationFee,
      modeOfPayment: modeOfPayment || "offline",
      paymentStatus: "pending"
    });

    appointments.push(appointment);

    item.status = "paid";
    await item.save();
  }

  return appointments;
};