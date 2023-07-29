const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {hashedData} = require("../utils/HashData");

const createNewUser = async ( userData ) => {
  try {
    const { firstName, lastName, email, password } = userData;
    let hashedPassword = await hashedData(password, 10);    

    const newUser = await prisma.user.create({
      data: {
        firstName, 
        lastName, 
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};


const findUserByEmail = async (email) => {
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return foundUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewUser,
  findUserByEmail,
};
