const {sendOTP} = require('../repositories/OtpRepository')

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



module.exports = { otpRequest }