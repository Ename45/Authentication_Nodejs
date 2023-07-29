const express = require("express");
const { otpRequest, verifyOTP } = require("../services/OtpService");
const router = express.Router();

router.post("/", otpRequest);
router.post("/verify-otp", verifyOTP)



module.exports = router;