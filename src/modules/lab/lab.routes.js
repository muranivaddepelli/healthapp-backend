const router = require("express").Router();
const controller = require("./lab.controller");
const upload = require("../../middleware/upload");

const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);


router.use(authMiddleware, roleMiddleware("lab"));



router.post("/logout", authMiddleware,roleMiddleware("lab"), controller.logout);
router.post("/tests",upload.single("image"),  controller.addTest);
router.post("/slots", controller.addSlots);

module.exports = router;