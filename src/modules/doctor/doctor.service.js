const repo = require("./doctor.repository");
const staffLogin = require("../../utils/staffLogin");
const Appointment = require("../../models/appointment");
const mongoose = require("mongoose");
const User = require("../../models/user");
const DoctorEvent = require("../../models/doctorEvent");

exports.login = async (hospitalName, username, password) => {

  return staffLogin({
    hospitalName,
    username,
    password,
    findStaff: repo.findDoctor,
    role: "doctor"
  });

};



exports.addAvailability = async (doctorId, data) => {

  return repo.createAvailability({
    ...data,
    doctorId
  });

};

exports.getAvailability = async (doctorId) => {

  return repo.getAvailability(doctorId);

};

exports.deleteAvailability = async (doctorId, id) => {

  const availability = await repo.deleteAvailability(id, doctorId);

  if (!availability) {
    throw new Error("Availability not found");
  }

  return { message: "Availability deleted successfully" };

};

exports.addException = async (doctorId, data) => {

  return repo.createException({
    ...data,
    doctorId
  });

};

exports.getExceptions = async (doctorId) => {

  return repo.getExceptions(doctorId);

};

exports.deleteException = async (doctorId, id) => {

  const exception = await repo.deleteException(id, doctorId);

  if (!exception) {
    throw new Error("Exception not found");
  }

  return { message: "Exception deleted successfully" };

};



exports.getDoctorSlots = async (doctorId, date) => {

  const day = new Date(date).toLocaleDateString("en-US", {
    weekday: "long"
  });

  const availability = await DoctorAvailability.find({
    doctorId,
    day
  });

  const slots = [];

  availability.forEach(a => {

    let start = new Date(`1970-01-01T${a.startTime}:00`);
    let end = new Date(`1970-01-01T${a.endTime}:00`);

    while (start < end) {

      slots.push(
        start.toTimeString().slice(0,5)
      );

      start.setMinutes(start.getMinutes() + 30);

    }

  });

  return slots;

};



exports.getDashboard = async (doctorId) => {

  const objectId = new mongoose.Types.ObjectId(doctorId);

  const result = await Appointment.aggregate([
    { $match: { doctorId: objectId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const map = {};
  result.forEach(item => {
    map[item._id] = item.count;
  });

  const totalAppointments =
    (map["booked"] || 0) +
    (map["checked-in"] || 0) +
    (map["in-progress"] || 0) +
    (map["completed"] || 0);

  const upcomingAppointments =
    (map["booked"] || 0) +
    (map["checked-in"] || 0) +
    (map["in-progress"] || 0);

  const completedAppointments = map["completed"] || 0;

  return {
    totalAppointments,
    upcomingAppointments,
    completedAppointments,

    breakdown: {
      total: [
        map["booked"] || 0,
        map["checked-in"] || 0,
        map["in-progress"] || 0
      ],

      upcoming: [
        map["booked"] || 0,
        map["checked-in"] || 0,
        map["in-progress"] || 0
      ],

      completed: [
        map["completed"] || 0
      ]
    }
  };
};




exports.createEvent = async (doctorId, data) => {

  if (!data.type) {
    throw new Error("Event type required");
  }

  if (data.type === "block") {

    return DoctorEvent.create({
      doctorId,
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type
    });
  }

  if (data.type === "appointment") {

    const user = await User.findById(data.userId);

    if (!user) {
      throw new Error("Patient not found");
    }

    const existing = await Appointment.findOne({
      doctorId,
      date: data.date,
      time: data.time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      throw new Error("Slot already booked");
    }

    const blocked = await DoctorEvent.findOne({
      doctorId,
      date: data.date,
      startTime: { $lte: data.time },
      endTime: { $gte: data.time }
    });

    if (blocked) {
      throw new Error("Doctor not available at this time");
    }

    return Appointment.create({
      doctorId,
      userId: data.userId,
      date: data.date,
      time: data.time,
      status: "booked",
      consultationFee: data.consultationFee || 0,
      modeOfPayment: "offline"
    });
  }

  throw new Error("Invalid event type");
};



exports.searchPatients = async (query) => {

  return User.find({
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } }
    ]
  }).select("firstName lastName email");
};


exports.getCalendarData = async (doctorId, date) => {

  const start = new Date(date);
  start.setHours(0,0,0,0);

  const end = new Date(date);
  end.setHours(23,59,59,999);

  const appointments = await Appointment.find({
    doctorId,
    date: { $gte: start, $lte: end }
  }).populate("userId", "username");

  const events = await DoctorEvent.find({
    doctorId,
    date: { $gte: start, $lte: end }
  });

  return { appointments, events };
};