const router = require("express").Router();

const controller = require("./user.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

router.get("/profile", authMiddleware, controller.getProfile);

router.put("/profile", authMiddleware, controller.updateProfile);

router.put("/upload-photo",authMiddleware,upload.single("profilePhoto"),controller.uploadProfilePhoto);

router.delete("/profile-photo", authMiddleware, controller.deleteProfilePhoto);
router.get(
  "/hospitals/nearby/:addressId",
  authMiddleware,
  controller.getNearbyHospitals
);

router.get(
  "/doctors",
  authMiddleware,
  controller.getDoctors
);
module.exports = router;


router.get(
  "/doctors/:doctorId",
  authMiddleware,
  controller.getDoctorDetails
);

router.get(
  "/doctors/:doctorId/slots",
  authMiddleware,
  controller.getDoctorSlots
);


router.post("/cart", authMiddleware, controller.addToCart);
router.get("/cart", authMiddleware, controller.getCart);
router.patch("/cart/:id/quantity", authMiddleware, controller.updateQuantity);
router.delete("/cart/:id", authMiddleware, controller.deleteCart);

router.post("/checkout", authMiddleware, controller.checkout);


router.get("/appointments", authMiddleware, controller.getUserAppointments);

router.get("/diagnostic/tests",authMiddleware,controller.getTests);

router.get("/diagnostic/slots",authMiddleware,controller.getSlots);