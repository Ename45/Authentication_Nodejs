const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../services/ForgotPasswordService");


router.post("/", forgotPassword)
module.exports = router;

