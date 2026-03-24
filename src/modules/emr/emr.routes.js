const router = require("express").Router();
const controller = require("./emr.controller");

router.get("/prescriptions/:id", controller.getPrescription);

module.exports = router;