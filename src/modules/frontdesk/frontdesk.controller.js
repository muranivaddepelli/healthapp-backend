const service = require("./frontdesk.service");
const {logout} = require("../../utils/logout");
const Appointment = require("../appointment/appointment.model");

exports.login = async (req, res) => {

  try {

    const { hospitalName, username, password } = req.body;

    const data = await service.login(
      hospitalName,
      username,
      password
    );

    res.json(data);

  } catch (err) {

    res.status(err.statusCode || 500).json({
      message: err.message
    });

  }

};

const Appointment = require("../../models/appointment");

const mapStatus = (status) => {
  if (status === "booked") return "waiting";
  if (status === "checked-in") return "in-progress";
  return status;
};

exports.getTodayAppointments = async (req, res) => {
  try {

    const { search, status, doctorId } = req.query;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let filter = {
      date: { $gte: todayStart, $lte: todayEnd }
    };

    if (status) {
      filter.status = status;
    }

    if (doctorId) {
      filter.doctorId = doctorId;
    }

    let appointments = await Appointment.find(filter)
      .populate({
        path: "userId",
        match: search
          ? { name: { $regex: search, $options: "i" } }
          : {},
        select: "name"
      })
      .populate({
        path: "doctorId",
        select: "name"
      });

    if (search) {
      appointments = appointments.filter(a => a.userId !== null);
    }

    const formatted = appointments.map(a => ({
      id: a._id,
      token: a.tokenNumber,
      patientName: a.userId?.name,
      doctorName: a.doctorId?.name,
      visitType: a.visitType,
      time: a.time,
      status: mapStatus(a.status)
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkInAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "in-progress",
        checkInTime: new Date()
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const tomorrowStart = new Date(todayEnd);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const [
      total,
      completed,
      waiting,
      cancelled,
      noShow,
      nextDay
    ] = await Promise.all([
      Appointment.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ status: "completed", date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ status: { $in: ["waiting", "confirmed"] }, date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ status: "cancelled", date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ status: "no-show", date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments({ date: { $gte: tomorrowStart, $lte: tomorrowEnd } })
    ]);

    res.json({
      totalAppointments: total,
      completed,
      waitingQueue: waiting,
      cancelled,
      noShows: noShow,
      nextDayAppointments: nextDay
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = logout;