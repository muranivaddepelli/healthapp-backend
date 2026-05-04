const service = require("./order.service");

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const data = await service.getOrderDetails(orderId, userId);

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


exports.updateLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { lat, lng, type } = req.body;

    if (!lat || !lng || !type) {
      return res.status(400).json({
        success: false,
        message: "lat, lng and type are required"
      });
    }

    let Model;

    if (type === "pharmacy") {
      Model = PharmacyOrder;
    } else if (type === "tests") {
      Model = LabOrder;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid order type"
      });
    }

    await Model.findByIdAndUpdate(orderId, {
      currentLocation: { lat, lng }
    });

    res.json({
      success: true,
      message: "Location updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getLabOrderDetails = async (req, res) => {
  try {

    const { orderId } = req.params;
    const userId = req.user.id;

    const data = await service.getLabOrderDetails(orderId, userId);

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};