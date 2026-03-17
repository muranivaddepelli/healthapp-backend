const service = require("./doctor.service");
const {logout} = require("../../utils/logout");

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