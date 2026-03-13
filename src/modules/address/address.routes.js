const router = require("express").Router();

const controller = require("./address.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, controller.addAddress);

router.get("/", authMiddleware, controller.getAddresses);

router.get("/:id", authMiddleware, controller.getAddress);

router.put("/:id", authMiddleware, controller.updateAddress);

router.delete("/:id", authMiddleware, controller.deleteAddress);

router.patch("/:id/default", authMiddleware, controller.setDefaultAddress);

module.exports = router;