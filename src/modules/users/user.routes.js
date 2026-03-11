const router = require("express").Router();

const controller = require("./user.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

router.get("/profile", authMiddleware, controller.getProfile);

router.put("/profile", authMiddleware, controller.updateProfile);

router.put("/upload-photo",authMiddleware,upload.single("profilePhoto"),controller.uploadProfilePhoto);

router.delete("/profile-photo", authMiddleware, controller.deleteProfilePhoto);

module.exports = router;