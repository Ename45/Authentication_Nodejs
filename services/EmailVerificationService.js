const { sendVerificationOTPEmail } = require('../repositories/EmailVerificationRepository')

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw Error("Email is required");
    }

    const createdEmailVerificationOTP = await sendVerificationOTPEmail( email )
    res.status(200).json(createdEmailVerificationOTP)

  } catch (error) {
    res.status(400).send(error.message)
  }
};

module.exports = {
  verifyEmail,
};
