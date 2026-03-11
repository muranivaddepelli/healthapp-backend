const router = require("express").Router();
const controller = require("./frontdesk.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);

router.use(authMiddleware, roleMiddleware("frontdesk"));


router.post("/logout", controller.logout);

module.exports = router;