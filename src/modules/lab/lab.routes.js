const router = require("express").Router();
const controller = require("./lab.controller");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("lab"));



router.post("/logout", authMiddleware,roleMiddleware("lab"), controller.logout);

module.exports = router;