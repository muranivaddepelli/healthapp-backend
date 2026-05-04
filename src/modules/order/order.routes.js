router.get("/orders/:orderId", controller.getOrderDetails);

const router = require("express").Router();
const controller = require("./order.controller");

router.get("/orders/:orderId", controller.getOrderDetails);
router.patch("/orders/:orderId/location", controller.updateLocation);
router.get("/lab-orders/:orderId", controller.getLabOrderDetails);
router.patch("/lab-orders/:orderId/location", controller.updateLocation);
module.exports = router;