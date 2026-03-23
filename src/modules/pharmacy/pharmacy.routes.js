const router = require("express").Router();
const controller = require("./pharmacy.controller");
const upload = require("../../middleware/upload");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);

router.use(authMiddleware, roleMiddleware("pharmacy"));

router.get("/openfda", controller.searchOpenFDA);
router.post("/medicine",upload.single("image"),controller.addMedicine);
router.put("/medicine/:id", controller.updateMedicine);
router.get("/my-medicines", controller.getMyMedicines);


router.get("/prescriptions",controller.getPrescriptions);

router.post("/prescription/:id/approve",controller.approvePrescription);
router.post("/prescription/:id/reject",controller.rejectPrescription
);

router.post("/logout", controller.logout);



module.exports = router;