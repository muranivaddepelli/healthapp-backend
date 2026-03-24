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

    const slots = await service.getDoctorSlots(doctorId, date);

    res.json({
      success: true,
      data: slots
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

    const { search } = req.query;

    const data = await service.searchPatients(search);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
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