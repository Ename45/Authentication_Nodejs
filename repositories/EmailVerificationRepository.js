const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOTP, verifyingOTP, deleteOTP } = require("../repositories/OtpRepository");

const sendVerificationOTPEmail = async ( email ) => {
  try {
    // check if an account exists

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!existingUser) {
      throw Error("There is no account for the provided email")
    }


    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "Verify you mail with the code below.",
      duration: 1,
    };

    const createdOTP = await sendOTP(otpDetails);

    return createdOTP

  } catch (error) {
    throw error
  }
};

const verifyUserEmailWithPin = async({email, otp}) => {
  try {
    const validOTP = await verifyingOTP({email, otp});

    if (!validOTP) {
      throw Error("Invalid otp passed. Check your email.")
    }

    await deleteOTP(email);
    return;

  } catch (error) {
    throw error;
  }
}

module.exports = { sendVerificationOTPEmail, verifyUserEmailWithPin }