const router = require("express").Router();
const controller = require("./emr.controller");
const auth = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload"); 

router.get("/prescriptions", auth, controller.getPrescriptions);

router.get("/prescriptions/:id", auth, controller.getPrescription);

router.get("/reports", auth, controller.getReports);

router.get("/pharmacy-bills", auth, controller.getPharmacyBills);

router.get("/bills", auth, controller.getAllBills);

router.post("/reports/upload", upload.single("file"), controller.uploadReport);
router.post("/prescriptions/upload",upload.single("file"),controller.uploadPrescription);
module.exports = router;