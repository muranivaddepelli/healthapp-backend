const router = require("express").Router();
const controller = require("./doctor.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { getDoctorAppointments } = require("./doctor.controller");

router.post("/login", controller.login);

router.use(authMiddleware, roleMiddleware("doctor"));

router.post("/logout", controller.logout);

router.post("/availability", controller.addAvailability);
router.get("/availability", controller.getAvailability);
router.delete("/availability/:id", controller.deleteAvailability);

router.post("/exceptions", controller.addException);
router.get("/exceptions", controller.getExceptions);
router.delete("/exceptions/:id", controller.deleteException);

router.get("/doctors/:doctorId/slots", controller.getDoctorSlots);

router.get("/appointments", getDoctorAppointments);


router.get("/dashboard", controller.getDashboard);

router.post("/events", controller.createEvent);

router.get("/patients/search", controller.searchPatients);

router.get("/calendar", controller.getCalendarData);

module.exports = router;