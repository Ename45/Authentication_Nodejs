const express = require('express')
const router = express.Router()
const { signUp } = require('../services/UserAuthentication')

router.post("/signup", signUp)


module.exports = router