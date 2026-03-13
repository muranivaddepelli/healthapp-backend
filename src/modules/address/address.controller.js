const service = require("./address.service");

exports.addAddress = async (req, res) => {

  try {

    const data = await service.addAddress(req.user.id, req.body);

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getAddresses = async (req, res) => {

  try {

    const data = await service.getAddresses(
      req.user.id,
      req.query.search
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

exports.getAddress = async (req, res) => {

  try {

    const data = await service.getAddress(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });

  }

};

exports.updateAddress = async (req, res) => {

  try {

    const data = await service.updateAddress(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });

  }

};

exports.deleteAddress = async (req, res) => {

  try {

    const data = await service.deleteAddress(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      ...data
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });

  }

};

exports.setDefaultAddress = async (req, res) => {

  try {

    const data = await service.setDefaultAddress(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });

  }

};