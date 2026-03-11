const router = require("express").Router();
const controller = require("./user.controller");
const auth = require("../../middleware/authMiddleware");

router.get("/profile", auth, controller.getProfile);

module.exports = router;