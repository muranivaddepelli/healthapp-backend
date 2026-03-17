const router = require("express").Router();
const controller = require("./doctor.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("doctor"));



router.post("/logout", authMiddleware,roleMiddleware("doctor"), controller.logout);





router.post(
  "/availability",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.addAvailability
);

router.get(
  "/availability",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.getAvailability
);

router.delete(
  "/availability/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.deleteAvailability
);


router.post(
  "/exceptions",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.addException
);

router.get(
  "/exceptions",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.getExceptions
);

router.delete(
  "/exceptions/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  controller.deleteException
);


router.get(
  "/doctors/:doctorId/slots",
  authMiddleware,
  controller.getDoctorSlots
);


module.exports = router;