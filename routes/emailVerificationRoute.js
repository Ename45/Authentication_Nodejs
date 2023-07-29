const express = require("express");
const router = express.Router();
const { verifyEmail, verifyPin } = require('../services/EmailVerificationService')


router.post("/", verifyEmail);
router.post("/verify", verifyPin);


module.exports = router;