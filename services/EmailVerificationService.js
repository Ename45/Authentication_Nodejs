const { sendVerificationOTPEmail, verifyUserEmailWithPin } = require('../repositories/EmailVerificationRepository')

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

const verifyPin = async(req, res) => {
  try {
    let { email, otp } = req.body

    if (!(email && otp)) {
      throw Error("Empty otp details are no allowed")
    }

    await verifyUserEmailWithPin({ email, otp })
    res.status(200).json({ email, verified: true});

  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  verifyEmail,
  verifyPin,
};
