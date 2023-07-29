const express = require("express");
const router = express.Router();
const {verifyEmail} = require('../services/EmailVerificationService')


router.post("/", verifyEmail);


module.exports = router;