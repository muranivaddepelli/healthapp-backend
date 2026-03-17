const router = require("express").Router();
const controller = require("./admin.controller");
// const upload = require("../../middleware/uploadMiddleware");
const upload = require("../../middleware/upload");


const authMiddleware= require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

router.post("/login", controller.login);

router.use(authMiddleware, roleMiddleware("admin"));
router.post("/logout", controller.logout);


router.post("/hospitals", controller.createHospital);
router.get("/hospitals", controller.getHospitals);
router.get("/hospitals/:id", controller.getHospitalById);
router.put("/hospitals/:id", controller.updateHospital);
router.delete("/hospitals/:id", controller.deleteHospital);

router.post(
  "/doctors",
  upload.single("profileImage"),
  controller.createDoctor
);
router.get("/doctors", controller.getDoctors);
router.get("/doctors/:id", controller.getDoctorById);
router.put("/doctors/:id", controller.updateDoctor);
router.delete("/doctors/:id", controller.deleteDoctor);

router.post("/frontdesks", controller.createFrontdesk);
router.get("/frontdesks", controller.getFrontdesks);
router.get("/frontdesks/:id", controller.getFrontdeskById);
router.put("/frontdesks/:id", controller.updateFrontdesk);
router.delete("/frontdesks/:id", controller.deleteFrontdesk);


router.post("/pharmacies", controller.createPharmacy);
router.get("/pharmacies", controller.getPharmacies);
router.get("/pharmacies/:id", controller.getPharmacyById);
router.put("/pharmacies/:id", controller.updatePharmacy);
router.delete("/pharmacies/:id", controller.deletePharmacy);    




router.post("/labs", controller.createLab);
router.get("/labs", controller.getLabs);
router.get("/labs/:id", controller.getLabById);
router.put("/labs/:id", controller.updateLab);
router.delete("/labs/:id", controller.deleteLab);


module.exports = router;