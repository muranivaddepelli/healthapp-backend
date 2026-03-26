const repo = require("./doctor.repository");
const staffLogin = require("../../utils/staffLogin");
const Appointment = require("../../models/appointment");
const mongoose = require("mongoose");
const User = require("../../models/user");
const DoctorEvent = require("../../models/doctorEvent");
const DoctorAvailability = require("../../models/doctorAvailability");
const Prescription = require("../../models/prescription");
const DoctorPrescription = require("../../models/DoctorPrescription");



const addMinutes = (time, mins = 30) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + mins);
  return date.toTimeString().slice(0,5);
};

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

  if (!data.day) {
    throw new Error("Day is required");
  }

  if (!Array.isArray(data.slots)) {
    throw new Error("Slots must be array");
  }

  data.slots = data.slots.map(slot => ({
  startTime: slot.startTime.slice(0,5),
  endTime: slot.endTime.slice(0,5)
}));

  await DoctorAvailability.deleteMany({
    doctorId,
    day: data.day
  });

  return DoctorAvailability.create({
    doctorId,
    day: data.day,
    slots: data.slots,
    isAvailable: data.isAvailable ?? true
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

  const selectedDate = new Date(date + "T00:00:00.000Z");

  const day = selectedDate.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const normalize = (time) => time.slice(0,5);

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

      let start = new Date(`1970-01-01T${normalize(slot.startTime)}:00`);
      let end = new Date(`1970-01-01T${normalize(slot.endTime)}:00`);

      while (start < end) {

        const time = normalize(start.toTimeString());

        slots.push(time);

        start.setMinutes(start.getMinutes() + 30);
      }

    });
  });

  if (exception && !exception.isFullDay) {
    const exStart = normalize(exception.startTime);
    const exEnd = normalize(exception.endTime);

    slots = slots.filter(time =>
      !(time >= exStart && time < exEnd)
    );
  }

  const booked = await Appointment.find({
    doctorId,
    date: selectedDate,
    status: { $ne: "cancelled" }
  });

  const bookedTimes = booked.map(b => normalize(b.time));

  slots = slots.filter(time => !bookedTimes.includes(time));

  const events = await DoctorEvent.find({
    doctorId,
    date: selectedDate
  });

  events.forEach(e => {
    const start = normalize(e.startTime);
    const end = normalize(e.endTime);

    slots = slots.filter(time =>
      !(time >= start && time < end)
    );
  });

  slots = [...new Set(slots)];
  slots.sort();

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

  const formatTime = (time) => {
  return time.slice(0,5); 
};


  if (!data.type) {
    throw new Error("Event type required");
  }

  if (data.type === "block") {

    return DoctorEvent.create({
      doctorId,
      title: data.title,
      date: data.date,
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
      type: data.type
    });
  }

  if (data.type === "appointment") {
    const formattedTime = formatTime(data.time);

    const user = await User.findById(data.userId);

    if (!user) {
      throw new Error("Patient not found");
    }

    const existing = await Appointment.findOne({
      doctorId,
      date: data.date,
      time: formattedTime,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      throw new Error("Slot already booked");
    }

    const blocked = await DoctorEvent.findOne({
      doctorId,
      date: data.date,
      startTime: { $lte: formattedTime },
      endTime: { $gte: formattedTime }
    });

    if (blocked) {
      throw new Error("Doctor not available at this time");
    }

    return Appointment.create({
      doctorId,
      userId: data.userId,
      date: data.date,
      time: formatTime(data.time),
      status: "booked",
      consultationFee: data.consultationFee || 0,
      modeOfPayment: "offline"
    });
  }

  throw new Error("Invalid event type");
};



exports.searchPatients = async (search) => {

  const query = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }

  return User.find(query).select("firstName lastName phone profilePhoto");
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



const convertTo24Hour = (time) => {
  if (!time.includes("AM") && !time.includes("PM")) return time;

  let [t, modifier] = time.split(" ");
  let [hours, minutes] = t.split(":");

  hours = parseInt(hours);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};




exports.getCalendarEvents = async (doctorId, startDate, endDate) => {

  const start = new Date(startDate + "T00:00:00.000Z");
  const end = new Date(endDate + "T23:59:59.999Z");

  const appointments = await Appointment.find({
    doctorId,
    date: { $gte: start, $lte: end },
    status: { $ne: "cancelled" }
  }).populate("userId", "firstName lastName");

  const events = await DoctorEvent.find({
    doctorId,
    date: { $gte: start, $lte: end }
  });

  const formattedAppointments = appointments.map(a => ({
    id: a._id,
    type: "appointment",
    title: `${a.userId?.firstName || ""} ${a.userId?.lastName || ""}`,
    date: a.date,
    startTime: convertTo24Hour(a.time),
endTime: addMinutes(a.time), 
    color: "blue" 
  }));

  const formattedEvents = events.map(e => ({
    id: e._id,
    type: "block",
    title: e.title,
    date: e.date,
    startTime: convertTo24Hour(e.startTime),
endTime: convertTo24Hour(e.endTime),
    color: "gray"
  }));

  const allEvents = [...formattedAppointments, ...formattedEvents];

  allEvents.sort((a, b) => {
    if (a.date === b.date) {
      return a.startTime.localeCompare(b.startTime);
    }
    return new Date(a.date) - new Date(b.date);
  });

  return allEvents;
};


exports.getUpcomingEvents = async (doctorId) => {

  const now = new Date();

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const appointments = await Appointment.find({
    doctorId,
    date: { $gte: todayStart, $lte: todayEnd },
    status: { $ne: "cancelled" }
  }).populate("userId", "firstName lastName");

  const events = await DoctorEvent.find({
    doctorId,
    date: { $gte: todayStart, $lte: todayEnd }
  });

  const all = [
    ...appointments.map(a => ({
      type: "appointment",
      title: `${a.userId.firstName} ${a.userId.lastName}`,
      startTime: a.time,
      endTime: addMinutes(a.time)
    })),
    ...events.map(e => ({
      type: "block",
      title: e.title,
      startTime: e.startTime,
      endTime: e.endTime
    }))
  ];

  const upcoming = all
    .map(e => {
      const [h, m] = e.startTime.split(":").map(Number);

      const eventDate = new Date();
      eventDate.setHours(h, m, 0, 0);

      const diff = Math.floor((eventDate - now) / (1000 * 60));

      return {
        ...e,
        minutesLeft: diff
      };
    })
    .filter(e => e.minutesLeft > 0) 
    .sort((a, b) => a.minutesLeft - b.minutesLeft)
    .slice(0, 5); 

  return upcoming;
};



exports.getPatientDetails = async (userId) => {

  const user = await User.findById(userId)
    .select("firstName lastName email phone age gender profilePhoto");

  if (!user) throw new Error("Patient not found");

  return user;
};



exports.getPatientPrescriptions = async (userId, date) => {

  const query = { userId };

  if (date) {
    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    query.createdAt = { $gte: start, $lte: end };
  }

  const prescriptions = await Prescription.find(query)
    .populate("doctorId", "firstName lastName")
    .sort({ createdAt: -1 });

  return prescriptions.map(p => ({
    id: p._id,
    date: p.createdAt,
    prescriptionId: p._id,
    prescribedBy: `${p.doctorId?.firstName || ""} ${p.doctorId?.lastName || ""}`
  }));
};




exports.createPrescription = async (doctorId, data) => {

  const user = await User.findById(data.userId);

  if (!user) {
    throw new Error("Patient not found");
  }

  const count = await DoctorPrescription.countDocuments({
    doctorId,
    userId: data.userId
  });

  const visitNumber = count + 1;

  const prescriptionId = `PID-${user.phone}-${visitNumber}`;

  return DoctorPrescription.create({
    doctorId,
    userId: data.userId,
    diagnosis: data.diagnosis,
    vitals: data.vitals,
    medicalHistory: data.medicalHistory,
    diagnostics: data.diagnostics,
    medicines: data.medicines,
    lifestyle: data.lifestyle,
    followUp: data.followUp,
    referral: data.referral,
    complaints: data.complaints,
    visitNumber,
    prescriptionId
  });
};



exports.getPatientHeader = async (doctorId, userId) => {

  const user = await User.findById(userId);

  if (!user) throw new Error("Patient not found");

  const visits = await Appointment.countDocuments({
    doctorId,
    userId,
    status: { $ne: "cancelled" }
  });

  const lastVisit = await Appointment.findOne({
    doctorId,
    userId,
    status: { $ne: "cancelled" }
  }).sort({ date: -1 });

  return {
    name: `${user.firstName} ${user.lastName}`,
    age: user.age,
    gender: user.gender,
    patientId: `PID-${user.phone}`,
    visits,
    lastVisit: lastVisit?.date || null,
    prescriptionId: `PID-${user.phone}-${visits + 1}`
  };
};

exports.getCurrentRx = async (req, res) => {
  try {

    const data = await service.getCurrentRx(
      req.user.id,
      req.params.id
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getPreviousFiles = async (userId) => {

  const files = await Prescription.find({ userId })
    .select("file filename createdAt")
    .sort({ createdAt: -1 });

  return files.map(f => ({
    id: f._id,
    name: f.filename,
    url: f.file,
    date: f.createdAt
  }));
};

exports.getComplaints = async (doctorId, userId) => {

  const latest = await DoctorPrescription.findOne({
    doctorId,
    userId
  }).sort({ createdAt: -1 });

  return latest?.diagnosis || "";
};


