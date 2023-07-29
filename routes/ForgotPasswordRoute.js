const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../services/ForgotPasswordService");


router.post("/", forgotPassword)
router.post("/reset", resetPassword)


module.exports = router;

