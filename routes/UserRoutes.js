const express = require('express')
const { signUp } = require('../services/UserAuthentication')
const router = express.Router()

router.post('/signup', signUp)


module.exports = router