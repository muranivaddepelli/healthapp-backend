const router = require("express").Router();
const controller = require("./frontdesk.controller");
const { getCalendarView } = require("./frontdesk.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);

router.use(authMiddleware, roleMiddleware("frontdesk"));

// router.get("/appointments", controller.getTodayAppointments);
// router.patch("/appointments/:id/check-in", controller.checkInAppointment);
// router.get("/dashboard", controller.getDashboardStats);

router.post("/logout", controller.logout);
// router.patch("/appointments/:id", controller.updateAppointment);
// router.patch("/appointments/:id/cancel", controller.cancelAppointment);
// router.patch("/appointments/:id/status", controller.updateStatus);
// router.get("/patients/search", controller.searchPatient);
// router.get("/doctors/:doctorId/slots", userController.getSlots);
// router.post("/appointments", controller.createAppointment);
// router.get("/calendar/events", controller.getCalendarEventsForFrontdesk);
// router.get("/appointments", controller.getAppointments);
// router.get("/stats", controller.getStats);








//new apis
router.get("/calendar", controller.getCalendarView);
router.post("/appointments", controller.createAppointment);
router.get("/patients/search", controller.searchPatient);
router.patch("/appointments/:id/queue", controller.sendToQueue);
router.patch("/appointments/:id/reschedule", controller.rescheduleAppointment);
router.patch("/appointments/:id/cancel", controller.cancelAppointment);
router.get("/appointments/:id/billing", controller.getBillingDetails);

console.log(" Lab-test routes loaded");

router.get("/lab-calendar", controller.getLabCalendar);
router.post("/create-test-appointment", controller.createTestAppointment);
router.put("/reschedule-test-appointment/:appointmentId", controller.rescheduleTestAppointment);
router.put("/cancel-test-appointment/:appointmentId",controller.cancelTestAppointment);


module.exports = router;