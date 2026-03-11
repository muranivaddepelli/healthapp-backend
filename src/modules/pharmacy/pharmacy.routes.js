const router = require("express").Router();
const controller = require("./pharmacy.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("pharmacy"));



router.post("/logout", authMiddleware,roleMiddleware("pharmacy"), controller.logout);

module.exports = router;