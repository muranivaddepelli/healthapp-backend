const router = require("express").Router();
const controller = require("./emr.controller");

router.get("/prescriptions/:id", controller.getPrescription);
router.get("/reports", controller.getReports);
router.get("/pharmacy-bills", controller.getPharmacyBills);
module.exports = router;