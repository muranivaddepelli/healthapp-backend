const service = require("./user.service");
const cloudinary = require("../../config/cloudinary");

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user._id || req.user.id;

    const data = await service.getProfile(userId);

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const data = await service.updateProfile(
      userId,
      req.body
    );

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


exports.uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const userId = req.user.id;

    const user = await service.getProfile(userId);

    if (user.profilePhoto) {

      const parts = user.profilePhoto.split("/");
      const filename = parts[parts.length - 1];
      const publicId = "user_profiles/" + filename.split(".")[0];

      await cloudinary.uploader.destroy(publicId);

    }

    const photoUrl = req.file.path;

    const updatedUser = await service.updateProfile(userId, {
      profilePhoto: photoUrl
    });

    res.json({
      message: "Profile photo updated successfully",
      profilePhoto: photoUrl,
      user: updatedUser
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};




exports.deleteProfilePhoto = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await service.getProfile(userId);

    if (!user.profilePhoto) {
      return res.status(404).json({
        message: "No profile photo found"
      });
    }

    const parts = user.profilePhoto.split("/");
    const filename = parts[parts.length - 1];
    const publicId = "user_profiles/" + filename.split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await service.updateProfile(userId, {
      profilePhoto: null
    });

    res.json({
      message: "Profile photo deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};



exports.getNearbyHospitals = async (req, res) => {

  try {

    const hospitals = await service.getNearbyHospitals(
      req.params.addressId
    );

    res.json({
      success: true,
      data: hospitals
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.getDoctors = async (req, res) => {

  try {

    const { specialization, location } = req.query;

    const doctors = await service.getDoctors(
      specialization,
      location
    );

    res.json({
      success: true,
      data: doctors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



exports.getDoctorDetails = async (req, res) => {
  try {

    const { doctorId } = req.params;

    const data = await service.getDoctorDetails(doctorId);

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


exports.getDoctorSlots = async (req, res) => {
  try {

    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

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


exports.addToCart = async (req, res) => {
  try {
    const data = await service.addToCart(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const data = await service.getCart(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const data = await service.updateQuantity(
      req.user.id,
      req.params.id,
      req.body.quantity
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await service.deleteCart(req.user.id, req.params.id);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const data = await service.checkout(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};