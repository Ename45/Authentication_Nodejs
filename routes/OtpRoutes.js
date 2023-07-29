const express = require("express");
const { otpRequest } = require("../services/OtpService");
const router = express.Router();

router.post("/", otpRequest);



module.exports = router;