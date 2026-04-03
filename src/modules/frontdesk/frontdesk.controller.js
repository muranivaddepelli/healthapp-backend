const service = require("./frontdesk.service");
const {logout} = require("../../utils/logout");
const appointmentService = require("../appointment/appointment.service");
const Appointment = require("../../models/appointment");
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

    let updateData = { status };

    if (status === "checked-in") {
      updateData.checkedInAt = new Date();
    }

    if (status === "in-progress") {
      updateData.inProgressAt = new Date();
    }

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);

    res.status(201).json({
      message: "Appointment created successfully",
      data: appointment
    });

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};


exports.getCalendarEventsForFrontdesk = async (req, res) => {
  try {

    const { doctorId, startDate, endDate } = req.query;

    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "doctorId, startDate and endDate required"
      });
    }

    const data = await service.getCalendarEvents(
      doctorId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {

    const { search, date, doctorId, status, visitType } = req.query;

    let filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    if (visitType) filter.visitType = visitType;

    let query = Appointment.find(filter)
      .populate("userId", "name")
      .populate("doctorId", "name");

    if (search) {
      query = query.populate({
        path: "userId",
        match: { name: { $regex: search, $options: "i" } }
      });
    }

    const data = await query.sort({ createdAt: -1 });

    const formatted = data
      .filter(a => a.userId) 
      .map(a => ({
        id: a._id,
        patient: a.userId?.name,
        doctor: a.doctorId?.name,
        visitType: a.visitType,
        time: a.time,
        status: a.status,
        payment: a.paymentStatus
      }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getStats = async (req, res) => {
  try {

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const waiting = await Appointment.countDocuments({
      status: { $in: ["waiting", "checked-in"] },
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const immediate = await Appointment.countDocuments({
      status: "checked-in",
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const completedAppointments = await Appointment.find({
      status: "completed",
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const completed = completedAppointments.length;

let avgMinutes = 0;

if (completedAppointments.length > 0) {

  const validAppointments = completedAppointments.filter(
    a => a.inProgressAt && a.completedAt
  );

  const totalTime = validAppointments.reduce((sum, a) => {

    const diff = (a.completedAt - a.inProgressAt) / (1000 * 60);

    return sum + diff;

  }, 0);

  avgMinutes = validAppointments.length > 0
    ? Math.round(totalTime / validAppointments.length)
    : 0;
}
    const cancelled = await Appointment.countDocuments({
      status: "cancelled",
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const total = await Appointment.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const cancellationRate =
      total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        waiting,
        immediate,              
        completed,
        avgMinutes,             
        cancelled,
        cancellationRate        
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.logout = logout;