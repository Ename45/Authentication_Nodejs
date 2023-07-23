const bcrypt = require("bcryptjs");

const saltRounds = 10

const hashData = async(data, saltRounds) => {
  const hashedData = await bcrypt.hash(data, saltRounds);
  return hashedData
}

module.exports = hashData