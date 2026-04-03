const service = require("./doctor.service");
const {logout} = require("../../utils/logout");
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
exports.logout = logout;





exports.addAvailability = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.addAvailability(
      doctorId,
      req.body
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};

exports.getAvailability = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.getAvailability(doctorId);

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

exports.deleteAvailability = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.deleteAvailability(
      doctorId,
      req.params.id
    );

    res.json({
      success: true,
      ...data
    });

  } catch (err) {

    res.status(404).json({
      success: false,
      message: err.message
    });

  }

};

exports.addException = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.addException(
      doctorId,
      req.body
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};

exports.getExceptions = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.getExceptions(doctorId);

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

exports.deleteException = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const data = await service.deleteException(
      doctorId,
      req.params.id
    );

    res.json({
      success: true,
      ...data
    });

  } catch (err) {

    res.status(404).json({
      success: false,
      message: err.message
    });

  }

};


exports.getDoctorSlots = async (req, res) => {
  try {

    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required"
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const slots = await service.getDoctorSlots(doctorId, selectedDate);

    res.json({
      success: true,
      data: {
        slots
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};



exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id; 

    const { status, date } = req.query;

    let filter = { doctorId };

    if (status) filter.status = status;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter)
.populate("userId", "firstName lastName email phone")    
  .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


exports.getDashboard = async (req, res) => {
  try {

    const data = await service.getDashboard(req.user.id);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.createEvent = async (req, res) => {
  try {

    const data = await service.createEvent(
      req.user.id,
      req.body
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



exports.searchPatients = async (req, res) => {
  try {
    const data = await service.searchPatients(req.query.search);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getCalendarData = async (req, res) => {
  try {

    const { date } = req.query;

    const data = await service.getCalendarData(
      req.user.id,
      date
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getCalendarEvents = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate required"
      });
    }

    const data = await service.getCalendarEvents(
      req.user.id,
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

exports.getUpcomingEvents = async (req, res) => {
  try {
    const data = await service.getUpcomingEvents(req.user.id);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getPatientDetails = async (req, res) => {
  try {
    const data = await service.getPatientDetails(req.params.id);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { date } = req.query;

    const data = await service.getPatientPrescriptions(
      req.params.id,
      date
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



exports.createPrescription = async (req, res) => {
  try {

    const data = await service.createPrescription(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getPatientHeader = async (req, res) => {
  try {

    const data = await service.getPatientHeader(
      req.user.id,
      req.params.id
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
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


exports.getPreviousFiles = async (req, res) => {
  try {

    const data = await service.getPreviousFiles(req.params.id);

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


exports.getComplaints = async (req, res) => {
  try {

    const data = await service.getComplaints(
      req.user.id,
      req.params.id
    );

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};