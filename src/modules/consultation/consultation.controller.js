const service = require("./consultation.service");

exports.getConsultationOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const data = await service.getConsultationOrderDetails(orderId, userId);

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