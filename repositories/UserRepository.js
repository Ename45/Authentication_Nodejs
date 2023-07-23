import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const hashData = require('../hashData/HashData')

const createNewUser = async (userData) => {
  try {
    const { name, email, password } = userData;
    const hashedPassword = hashData(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
    return newUser
    
  } catch (error) {
    throw error
  }
};

const findUserByEmail = async (email) => {
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return foundUser;
  } catch (error) {
    throw error
  }
};



module.exports = {
  createNewUser,
  findUserByEmail,
};
