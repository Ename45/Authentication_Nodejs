const { sendPasswordRestOTPEmail, resetUserPassword } = require("../repositories/ForgotPasswordRepository")

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


const resetPassword = async(req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!(email && otp && newPassword)) {
      throw Error ("Empty credentials are not allowed")
    }

    await resetUserPassword({email, otp, newPassword})

    res.status(200).json({ email, passwordReset: true})
  } catch (error) {
    res.status(400).send(error.message)
  }
}


module.exports = {forgotPassword, resetPassword }