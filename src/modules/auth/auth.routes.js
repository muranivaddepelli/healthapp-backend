const router = require("express").Router();
const controller = require("./auth.controller");

router.post("/signup", controller.signup);
router.post("/verify-otp", controller.verifyOtp);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-reset-otp", controller.verifyResetOtp);
router.post("/reset-password", controller.resetPassword);
router.post("/resend-otp", controller.resendOtp);
router.post("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);




module.exports = router;