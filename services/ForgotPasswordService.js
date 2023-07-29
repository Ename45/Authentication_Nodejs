const { sendPasswordRestOTPEmail } = require("../repositories/ForgotPasswordRepository")

const forgotPassword = async(req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw Error("Am email is required.")
    }

    const createdPasswordResetOTP = await sendPasswordRestOTPEmail(email);

    res.status(200).json(createdPasswordResetOTP)

  } catch (error) {
    res.status(400).send(error.message)
  }
}



module.exports = {forgotPassword}