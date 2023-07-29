const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOTP, verifyingOTP, deleteOTP } = require("../repositories/OtpRepository")
const { hashedData } = require('../utils/HashData')



const sendPasswordRestOTPEmail = async (email) => {
  try {
    // check if an account exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!existingUser) {
      throw Error("No account matches this email.")
    }

    if (!existingUser.verified) {
      throw Error("Email has not been verified yet. Check your email")
    }

    const otpDetails = {
      email,
      subject: "Password Reset",
      message: "Enter the code below to reset your password.",
      duration: 1,
    };

    const createdOTP = await sendOTP(otpDetails)

    return createdOTP

  } catch (error) {
    throw error
  }
};


const resetUserPassword = async({ email, otp, newPassword }) => {
  try {
    const validOTP = await verifyingOTP({ email, otp });

    if (!validOTP) {
      throw Error("Invalid code passes. Check your email")
    }

    // update user record with new password
    if (newPassword.length < 5) {
      throw Error("Password must be at least 5 characters long.");
    }

    const hashedNewPassword = await hashedData(newPassword);

    await prisma.user.update({
      where: {
        email: email
      },
      data: {
        password: hashedNewPassword
      }
    })

    await deleteOTP(email);

    return;

  } catch (error) {
    throw error
  }
}



module.exports = {
  sendPasswordRestOTPEmail,
  resetUserPassword
}