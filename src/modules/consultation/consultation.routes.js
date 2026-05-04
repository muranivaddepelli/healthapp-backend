const router = require("express").Router();
const controller = require("./consultation.controller");
const auth = require("../../middlewares/auth");

router.get("/:orderId", auth, controller.getConsultationOrderDetails);

module.exports = router;