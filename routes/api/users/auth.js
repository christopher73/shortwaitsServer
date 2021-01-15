const express = require("express");
const controllers = require("../../../controllers");
const mw = require("../../../middlewares");
const router = express.Router();

router.post("/verify-num", mw.rateLimiter, controllers.users.auth.verifyNum);
router.post("/verify-otp", mw.rateLimiter, controllers.users.auth.verifyOTP);
router.post("/resend-otp", mw.rateLimiter, controllers.users.auth.resendOTP);
router.post("/register", controllers.users.auth.register);

module.exports = router;
