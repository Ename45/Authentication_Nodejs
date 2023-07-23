const jwt = require('jsonwebtoken')
// require("dotenv").config();

const { JWT_SECRET, JWT_EXPIRY } = process.env

const createJwtToken = async(tokenData, tokenKey = JWT_SECRET, tokenExpiry = JWT_EXPIRY) => {
  try {
    const token = await jwt.sign(tokenData, tokenKey, { expiresIn: tokenExpiry });
    return token
  } catch (error) {
    throw error
  }
}

module.exports = createJwtToken