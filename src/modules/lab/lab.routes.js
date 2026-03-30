const router = require("express").Router();
const controller = require("./lab.controller");
const upload = require("../../middleware/upload");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("lab"));



router.post("/logout", authMiddleware,roleMiddleware("lab"), controller.logout);
router.post("/tests",upload.single("image"),  controller.createTest);
router.post("/slots", controller.addSlots);


router.get("/dashboard-stats", controller.getDashboardStats);
router.get("/orders", controller.getOrders);
router.get("/orders/:id", controller.getOrderById);

router.put("/update-status", controller.updateStatus);

router.post("/upload-report",upload.single("file"),controller.uploadReport);
router.get("/report/:orderId", controller.previewReport);
router.get("/patients", controller.getPatients);
router.get("/patients/:patientId/reports", controller.getPatientReports);
module.exports = router;