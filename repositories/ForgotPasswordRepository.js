const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOTP } = require("../repositories/OtpRepository")



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



module.exports = {
  sendPasswordRestOTPEmail,
}