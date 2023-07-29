const { sendOTP, verifyingOTP } = require('../repositories/OtpRepository')

const otpRequest = async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;

    const createdOTP = await sendOTP({ 
      email, 
      subject, 
      message, 
      duration 
    });

    res.status(200).json(createdOTP);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const verifyOTP = async(req, res) => {
  try {
    const { email, otp } = req.body
    
    const validOTP = await verifyingOTP({ email, otp })
    res.status(200).json({valid: validOTP})
  } catch (error) {
    res.status(400).send(error.message)
  }
}



module.exports = { otpRequest, verifyOTP }