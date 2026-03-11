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