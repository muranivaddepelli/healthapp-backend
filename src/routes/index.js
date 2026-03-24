const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const doctorRoutes = require("../modules/doctor/doctor.routes");
const frontdeskRoutes = require("../modules/frontdesk/frontdesk.routes");
const labRoutes = require("../modules/lab/lab.routes");
const pharmacyRoutes = require("../modules/pharmacy/pharmacy.routes");
const addressRoutes = require("../modules/address/address.routes");
const emrRoutes = require("../modules/emr/emr.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/doctor", doctorRoutes);
router.use("/frontdesk", frontdeskRoutes);
router.use("/lab", labRoutes);
router.use("/pharmacy", pharmacyRoutes);

router.use("/addresses", addressRoutes);
router.use("/emr", emrRoutes);


module.exports = router;