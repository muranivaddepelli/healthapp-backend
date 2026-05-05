const service = require("./frontdesk.service");
const {logout} = require("../../utils/logout");
const appointmentService = require("../appointment/appointment.service");
const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const Lab = require("../../models/lab");
const LabAvailability = require("../../models/labAvailability");
const DiagnosticOrder = require("../../models/diagnosticOrder");
const Phlebotomist = require("../../models/phlebotomist");

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


// const mapStatus = (status) => {
//   if (status === "booked") return "waiting";
//   if (status === "checked-in") return "in-progress";
//   return status;
// };

// exports.getTodayAppointments = async (req, res) => {
//   try {

//     const { search, status, doctorId } = req.query;

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     let filter = {
//       date: { $gte: todayStart, $lte: todayEnd }
//     };

//     if (status) {
//       filter.status = status;
//     }

//     if (doctorId) {
//       filter.doctorId = doctorId;
//     }

//     let appointments = await Appointment.find(filter)
//       .populate({
//         path: "userId",
//         match: search
//           ? { name: { $regex: search, $options: "i" } }
//           : {},
//         select: "name"
//       })
//       .populate({
//         path: "doctorId",
//         select: "name"
//       });

//     if (search) {
//       appointments = appointments.filter(a => a.userId !== null);
//     }

//     const formatted = appointments.map(a => ({
//       id: a._id,
//       token: a.tokenNumber,
//       patientName: a.userId?.name,
//       doctorName: a.doctorId?.name,
//       visitType: a.visitType,
//       time: a.time,
//       status: mapStatus(a.status)
//     }));

//     res.json(formatted);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.checkInAppointment = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const updated = await Appointment.findByIdAndUpdate(
//       id,
//       {
//         status: "in-progress",
//         checkInTime: new Date()
//       },
//       { new: true }
//     );

//     res.json(updated);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.getDashboardStats = async (req, res) => {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const tomorrowStart = new Date(todayEnd);
//     tomorrowStart.setDate(tomorrowStart.getDate() + 1);

//     const tomorrowEnd = new Date(tomorrowStart);
//     tomorrowEnd.setHours(23, 59, 59, 999);

//     const [
//       total,
//       completed,
//       waiting,
//       cancelled,
//       noShow,
//       nextDay
//     ] = await Promise.all([
//       Appointment.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } }),
//       Appointment.countDocuments({ status: "completed", date: { $gte: todayStart, $lte: todayEnd } }),
//       Appointment.countDocuments({ status: { $in: ["waiting", "confirmed"] }, date: { $gte: todayStart, $lte: todayEnd } }),
//       Appointment.countDocuments({ status: "cancelled", date: { $gte: todayStart, $lte: todayEnd } }),
//       Appointment.countDocuments({ status: "no-show", date: { $gte: todayStart, $lte: todayEnd } }),
//       Appointment.countDocuments({ date: { $gte: tomorrowStart, $lte: tomorrowEnd } })
//     ]);

//     res.json({
//       totalAppointments: total,
//       completed,
//       waitingQueue: waiting,
//       cancelled,
//       noShows: noShow,
//       nextDayAppointments: nextDay
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await Appointment.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );

//     res.json(updated);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.cancelAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await Appointment.findByIdAndUpdate(
//       id,
//       { status: "cancelled" },
//       { new: true }
//     );

//     res.json(updated);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateStatus = async (req, res) => {
//   try {

//     const { id } = req.params;
//     const { status } = req.body;

//     let updateData = { status };

//     if (status === "checked-in") {
//       updateData.checkedInAt = new Date();
//     }

//     if (status === "in-progress") {
//       updateData.inProgressAt = new Date();
//     }

//     if (status === "completed") {
//       updateData.completedAt = new Date();
//     }

//     const updated = await Appointment.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: updated
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };


// exports.createAppointment = async (req, res) => {
//   try {
//     const appointment = await appointmentService.createAppointment(req.body);

//     res.status(201).json({
//       message: "Appointment created successfully",
//       data: appointment
//     });

//   } catch (err) {
//     res.status(400).json({
//       message: err.message
//     });
//   }
// };


// exports.getCalendarEventsForFrontdesk = async (req, res) => {
//   try {

//     const { doctorId, startDate, endDate } = req.query;

//     if (!doctorId || !startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "doctorId, startDate and endDate required"
//       });
//     }

//     const data = await service.getCalendarEvents(
//       doctorId,
//       startDate,
//       endDate
//     );

//     res.json({
//       success: true,
//       data
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// exports.getAppointments = async (req, res) => {
//   try {

//     const { search, date, doctorId, status, visitType } = req.query;

//     let filter = {};

//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);

//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);

//       filter.date = { $gte: start, $lte: end };
//     }

//     if (doctorId) filter.doctorId = doctorId;
//     if (status) filter.status = status;
//     if (visitType) filter.visitType = visitType;

//     let query = Appointment.find(filter)
//       .populate("userId", "name")
//       .populate("doctorId", "name");

//     if (search) {
//       query = query.populate({
//         path: "userId",
//         match: { name: { $regex: search, $options: "i" } }
//       });
//     }

//     const data = await query.sort({ createdAt: -1 });

//     const formatted = data
//       .filter(a => a.userId) 
//       .map(a => ({
//         id: a._id,
//         patient: a.userId?.name,
//         doctor: a.doctorId?.name,
//         visitType: a.visitType,
//         time: a.time,
//         status: a.status,
//         payment: a.paymentStatus
//       }));

//     res.json({
//       success: true,
//       data: formatted
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// exports.getStats = async (req, res) => {
//   try {

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const waiting = await Appointment.countDocuments({
//       status: { $in: ["waiting", "checked-in"] },
//       date: { $gte: todayStart, $lte: todayEnd }
//     });

//     const immediate = await Appointment.countDocuments({
//       status: "checked-in",
//       date: { $gte: todayStart, $lte: todayEnd }
//     });

//     const completedAppointments = await Appointment.find({
//       status: "completed",
//       date: { $gte: todayStart, $lte: todayEnd }
//     });

//     const completed = completedAppointments.length;

// let avgMinutes = 0;

// if (completedAppointments.length > 0) {

//   const validAppointments = completedAppointments.filter(
//     a => a.inProgressAt && a.completedAt
//   );

//   const totalTime = validAppointments.reduce((sum, a) => {

//     const diff = (a.completedAt - a.inProgressAt) / (1000 * 60);

//     return sum + diff;

//   }, 0);

//   avgMinutes = validAppointments.length > 0
//     ? Math.round(totalTime / validAppointments.length)
//     : 0;
// }
//     const cancelled = await Appointment.countDocuments({
//       status: "cancelled",
//       date: { $gte: todayStart, $lte: todayEnd }
//     });

//     const total = await Appointment.countDocuments({
//       date: { $gte: todayStart, $lte: todayEnd }
//     });

//     const cancellationRate =
//       total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;

//     res.json({
//       success: true,
//       data: {
//         waiting,
//         immediate,              
//         completed,
//         avgMinutes,             
//         cancelled,
//         cancellationRate        
//       }
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
















const Doctor = require("../../models/doctor");
const DoctorAvailability = require("../../models/doctorAvailability");

const generateSlots = () => {
  const slots = [];
  let start = 9 * 60;
  let end = 18 * 60;

  while (start < end) {
    const h = String(Math.floor(start / 60)).padStart(2, "0");
    const m = String(start % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    start += 10;
  }

  return slots;
};

const convertToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const generateAvailableSlots = (availability) => {
  const slots = [];

  availability.slots.forEach((range) => {
    let start = convertToMinutes(range.startTime);
    let end = convertToMinutes(range.endTime);

    while (start < end) {
      slots.push(formatTime(start));
      start += 10;
    }
  });

  return slots;
};

const getDayName = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
};

const mapStatus = (status) => {
  switch (status) {
    case "waiting":
    case "confirmed":
      return "booked";
    case "in-progress":
      return "in-progress";
    case "completed":
      return "done";
    default:
      return "free";
  }
};

exports.getCalendarView = async (req, res, next) => {
  try {
    const { date, hospitalId, specialization } = req.query;

    if (!date || !hospitalId) {
      return res.status(400).json({
        success: false,
        message: "date and hospitalId are required"
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayName = getDayName(date);

    let doctorFilter = {
      hospitalId,
      isActive: true
    };

    if (specialization) {
      const specs = specialization.split(",");
      doctorFilter.specialization = {
        $in: specs.map(s => new RegExp(`^${s}$`, "i"))
      };
    }

    const [doctors, appointments, availabilities] = await Promise.all([
      Doctor.find(doctorFilter),

      Appointment.find({
        hospitalId,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate("userId", "firstName lastName phone"),

      DoctorAvailability.find({
        day: dayName,
        isAvailable: true
      })
    ]);

    const timeSlots = generateSlots();

    const data = doctors.map((doctor) => {

      const doctorAppointments = appointments.filter(
        (a) => a.doctorId.toString() === doctor._id.toString()
      );

      const doctorAvailability = availabilities.find(
        (a) => a.doctorId.toString() === doctor._id.toString()
      );

      const availableSlots = doctorAvailability
        ? generateAvailableSlots(doctorAvailability)
        : [];

      const slots = timeSlots.map((time) => {

        const appt = doctorAppointments.find((a) => a.time === time);

if (appt && appt.status !== "cancelled") {
          return {
            time,
            status: mapStatus(appt.status), 
            appointmentId: appt._id,
            appointment: {
              id: appt._id,
              patientName: `${appt.userId?.firstName || ""} ${appt.userId?.lastName || ""}`,
              phone: appt.phone || appt.userId?.phone,
              visitType: appt.visitType,
              date: appt.date,
              time: appt.time,
              status: appt.status
            }
          };
        }

        if (!availableSlots.includes(time)) {
          return {
            time,
            status: "blocked"
          };
        }

        return {
          time,
          status: "free"
        };
      });

      return {
        doctorId: doctor._id,
        doctorName: doctor.username,
        specialization: doctor.specialization,
        slots
      };
    });

    return res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      hospitalId,
      date,
      time,
      visitType,
      phone   
    } = req.body;

    const existing = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    const count = await Appointment.countDocuments({
      doctorId,
      date: new Date(date)
    });

    const tokenNumber = count + 1;

    const appointment = await Appointment.create({
      userId,
      doctorId,
      hospitalId,
      date: new Date(date),
      time,
      visitType,
      phone, 
      tokenNumber,
      status: "confirmed"
    });

    res.json({
      success: true,
      message: "Appointment created",
      data: appointment
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


exports.searchPatient = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const patients = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }   
      ]
    })
      .limit(10)
      .select("_id firstName lastName phone age gender dob"); 

    res.json({
      success: true,
      data: patients.map(p => ({
        id: p._id,
        name: `${p.firstName} ${p.lastName}`,
        phone: p.phone,
        age: p.age,
        gender: p.gender,
        dob: p.dob
      }))
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.sendToQueue = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.hospitalId.toString() !== req.user.hospitalId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot send cancelled appointment to queue"
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Appointment already completed"
      });
    }

    if (appointment.status === "waiting") {
      return res.status(400).json({
        message: "Already in queue"
      });
    }

    if (appointment.status !== "confirmed") {
      return res.status(400).json({
        message: "Only booked appointments allowed"
      });
    }

    const queueCount = await Appointment.countDocuments({
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: "waiting"
    });

    const updated = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "waiting",
        checkedInAt: new Date(),
        tokenNumber: queueCount + 1
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Patient added to queue",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};




exports.rescheduleAppointment = async (req, res) => {
  try {
    console.log("User:", req.user);

    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "date and time are required"
      });
    }

    const dayName = getDayName(date);

            console.log("Selected Date:", date);
    console.log("Day Name:", dayName);



    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    console.log("Appointment hospital:", appointment.hospitalId.toString());
    console.log("User hospital:", req.user.hospitalId);

    if (appointment.hospitalId.toString() !== req.user.hospitalId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    if (["cancelled", "completed"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Cannot reschedule this appointment"
      });
    }

    if (
      appointment.time === time &&
      new Date(appointment.date).toDateString() === new Date(date).toDateString()
    ) {
      return res.status(400).json({
        message: "Already booked in same slot"
      });
    }

    const existing = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(date),
      time,
      status: { $ne: "cancelled" },
      _id: { $ne: id }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }


    const availability = await DoctorAvailability.findOne({
      doctorId: appointment.doctorId,
      day: dayName,
      isAvailable: true
    });

    if (!availability) {
      return res.status(400).json({
        message: "Doctor not available on selected day"
      });
    }

    const isValidTime = availability.slots.some(
      (slot) => time >= slot.startTime && time < slot.endTime
    );

    if (!isValidTime) {
      return res.status(400).json({
        message: "Selected time is outside doctor availability"
      });
    }

    appointment.date = new Date(date);
    appointment.time = time;
    appointment.status = "confirmed";

    appointment.tokenNumber = null;
    appointment.checkedInAt = null;
    appointment.inProgressAt = null;

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.hospitalId.toString() !== req.user.hospitalId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Already cancelled"
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Completed appointment cannot be cancelled"
      });
    }

    appointment.status = "cancelled";

    appointment.tokenNumber = null;
    appointment.checkedInAt = null;
    appointment.inProgressAt = null;

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


exports.getBillingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("userId", "firstName lastName phone")
      .populate("doctorId", "username specialization consultationFee");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.hospitalId.toString() !== req.user.hospitalId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot bill cancelled appointment"
      });
    }

    res.json({
      success: true,
      data: {
        appointmentId: appointment._id,

        patientName: `${appointment.userId?.firstName || ""} ${appointment.userId?.lastName || ""}`,
        phone: appointment.phone || appointment.userId?.phone,

        doctorId: appointment.doctorId?._id,
        doctorName: appointment.doctorId?.username,
        specialization: appointment.doctorId?.specialization,

        date: appointment.date,
        time: appointment.time,

        visitType: appointment.visitType,

        consultationFee: appointment.doctorId?.consultationFee || 0,
        totalAmount: appointment.doctorId?.consultationFee || 0,

        status: appointment.status
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};




const generateLabSlots = () => {
  const slots = [];
  let start = 8 * 60;
  let end = 12 * 60;

  while (start < end) {
    const h = String(Math.floor(start / 60)).padStart(2, "0");
    const m = String(start % 60).padStart(2, "0");

    slots.push(`${h}:${m}`);
    start += 30;
  }

  return slots;
};

exports.getLabCalendar = async (req, res) => {
  try {
    const { date, hospitalId } = req.query;

    if (!date || !hospitalId) {
      return res.status(400).json({
        success: false,
        message: "date and hospitalId are required"
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayName = getDayName(date);

    const [phlebotomists, orders] = await Promise.all([
      Phlebotomist.find({
        hospitalId,
        isActive: true
      }),

      DiagnosticOrder.find({
        hospitalId,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate("userId", "firstName lastName phone")
    ]);

    const data = await Promise.all(
      phlebotomists.map(async (phlebo) => {

        const availability = await LabAvailability.findOne({
          phlebotomistId: phlebo._id,
          day: dayName,
          isAvailable: true
        });

const phleboOrders = orders.filter(
  (o) => o.phlebotomistId?.toString() === phlebo._id.toString()
);
        let slots = [];

        if (availability) {
          availability.slots.forEach((slot) => {

            let start = convertToMinutes(slot.startTime);
            let end = convertToMinutes(slot.endTime);

            while (start < end) {
              const time = formatTime(start);

              const order = phleboOrders.find((o) => o.time === time);

              if (order && order.status !== "cancelled") {
                slots.push({
                  time,
                  status: mapStatus(order.status),
                  appointmentId: order._id,
                  appointment: {
                    id: order._id,
                    patientName: `${order.userId?.firstName || ""} ${order.userId?.lastName || ""}`,
                    phone: order.userId?.phone,
                    tests: order.tests,
                    status: order.status
                  }
                });
              } else {
                slots.push({
                  time,
                  status: "free"
                });
              }

              start += 30; 
            }
          });
        }

        return {
          phlebotomistId: phlebo._id,
          phlebotomistName: phlebo.name,
          slots
        };
      })
    );

    return res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Lab Calendar Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.createTestAppointment = async (req, res) => {
  try {
    const {
      userId,
      hospitalId,
      phlebotomistId ,
      tests,
      date,
      time,
      address,
      mode = "home"
    } = req.body;

    if (!userId || !hospitalId || !phlebotomistId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await DiagnosticOrder.findOne({
      technicianId: phlebotomistId, // mapping
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const count = await DiagnosticOrder.countDocuments({
      hospitalId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const tokenNumber = count + 1;

    const totalAmount = (tests || []).reduce(
      (sum, t) => sum + (t.price || 0),
      0
    );

    const order = await DiagnosticOrder.create({
      userId,
      hospitalId,
      phlebotomistId: phlebotomistId, 
      tests,
      totalAmount,
      date: startOfDay,
      time,
      address,
      mode,
      status: "confirmed",
      tokenNumber
    });

    res.json({
      success: true,
      message: "Appointment booked successfully",
      data: order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.rescheduleTestAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const { date, time, phlebotomistId } = req.body;

    if (!appointmentId || !date || !time || !phlebotomistId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await DiagnosticOrder.findOne({
      _id: { $ne: appointmentId },
      phlebotomistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const updated = await DiagnosticOrder.findByIdAndUpdate(
      appointmentId,
      {
        date: startOfDay,
        time,
        phlebotomistId,
        status: "confirmed"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    return res.json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: updated
    });

  } catch (err) {
    console.error("Reschedule Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.cancelTestAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required"
      });
    }

    const appointment = await DiagnosticOrder.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.logout = logout;

module.exports = {
  login: exports.login,
  logout: exports.logout,
  getCalendarView: exports.getCalendarView,
  createAppointment: exports.createAppointment,
  searchPatient: exports.searchPatient,
  sendToQueue: exports.sendToQueue,
  rescheduleAppointment: exports.rescheduleAppointment,
  cancelAppointment: exports.cancelAppointment,
  getBillingDetails: exports.getBillingDetails,
  getLabCalendar: exports.getLabCalendar,
  createTestAppointment: exports.createTestAppointment,
  rescheduleTestAppointment: exports.rescheduleTestAppointment,
  cancelTestAppointment: exports.cancelTestAppointment
};


