const repo = require("./doctor.repository");
const staffLogin = require("../../utils/staffLogin");

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