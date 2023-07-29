const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateOTP = require("../utils/generateOTP");
const sendEmail = require('../utils/SendEmail');
const { hashedData } = require('../utils/HashData')
require('dotenv').config

const sendOTP = async ({ email, subject, message, duration=1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("provide values for email, subject, message");
    }

    // await prisma.oTP.delete({
    //     where: {
    //       email: email,
    //     },
    // });

    const generatedOTP = await generateOTP();

    
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hour(s)</b></p>`,
    };

    await sendEmail(mailOptions);

    // save otp record to database
    const hashedOTP = await hashedData(generatedOTP, 10)

    const createdOTPInRecord = await prisma.oTP.create({
      data: {
        otp: hashedOTP,
        createdAt: new Date(), 
        expiresAt: new Date(Date.now() + 3600000 * +duration),
      },
    });

    return createdOTPInRecord
    
    }
  catch (error) {
    throw error
  }
};


module.exports = { sendOTP }




    // const generatedOTP = await generateOTP();

    // // const mailOptions = {
    // //   from: process.env.AUTH_EMAIL,
    // //   to: email,
    // //   subject,
    // //   html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hour(s)</b></p>`
    // // }

    // // await sendEmail(mailOptions)

    // const hashedOTP = await hashData(generatedOTP)
    // const newOTP = await prisma.oTP.create({
    //   email,
    //   otp: hashedOTP,
    //   expiresAt: Date.now() + 3600000 * +duration,
    // })

    // return newOTP
