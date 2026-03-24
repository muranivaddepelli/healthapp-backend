const service = require("./emr.service");

exports.getPrescription = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.getPrescription(id);

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