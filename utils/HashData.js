const bcrypt = require("bcryptjs");

// const saltRounds = 10

const hashData = async(data, saltRounds=10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error
  }
}

const verifyHashedData = async(rawData, hashed) => {
  try {
    const isDataMatch = await bcrypt.compare(rawData, hashed);
    return isDataMatch;
  } catch (error) {
    throw error;
  }
}

module.exports = {hashData, verifyHashedData}