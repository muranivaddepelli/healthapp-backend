const router = require("express").Router();
const controller = require("./doctor.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("doctor"));



router.post("/logout", authMiddleware,roleMiddleware("doctor"), controller.logout);

module.exports = router;