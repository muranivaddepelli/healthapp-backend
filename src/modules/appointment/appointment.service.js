
const Appointment = require("../../models/appointment");

exports.createAppointment = async (data) => {
  try {
    const {
      userId,
      doctorId,
      hospitalId,
      date,
      time,
      visitType,
      consultationFee,
      modeOfPayment
    } = data;

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    const existing = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      time,
      status: { $in: ["waiting", "confirmed", "in-progress"] }
    });

    if (existing) {
      throw new Error("Slot already booked");
    }

    const start = new Date(appointmentDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(appointmentDate);
    end.setHours(23, 59, 59, 999);

    const count = await Appointment.countDocuments({
      date: { $gte: start, $lte: end }
    });

    const tokenNumber = `T-${100 + count + 1}`;

    return await Appointment.create({
      userId,
      doctorId,
      hospitalId,
      date: appointmentDate,
      time,
      visitType,
      consultationFee,
      modeOfPayment: modeOfPayment || "offline",
      paymentStatus: "pending",
      tokenNumber,
      status: "waiting"
    });

  } catch (err) {
    throw err;
  }
};