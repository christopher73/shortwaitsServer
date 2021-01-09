const express = require("express");
const controllers = require("../../../controllers");

const router = express.Router();

router.post("/register", controllers.users.auth.register);
// router.post("/login", AuthController.login);
// router.post("/verify-otp", AuthController.verifyConfirm);
// router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;
