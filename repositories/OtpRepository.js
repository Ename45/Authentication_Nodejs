const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateOTP = require("../utils/generateOTP");
const sendEmail = require('../utils/SendEmail');
const { hashedData, verifyHashedData } = require('../utils/HashData')
require('dotenv').config


const verifyingOTP = async({ email, otp }) => {
  try {
    if (!( email && otp )) {
      throw Error("Provide values for email, otp")
    }


    console.log("Searching for OTP record with otp:", otp);

    // ensure otp record exists

    const matchedOTPRecord = await prisma.oTP.findFirst({
      where: {
        email,
      }
    })


    console.log("Matched OTP Record:", matchedOTPRecord);

    if (!matchedOTPRecord) {
      throw Error("No otp records found");
    }

    // if a match, check otp isn't expired

    const { expiresAt } = matchedOTPRecord;

    // checking if expiry date is less than current date
    if (expiresAt < Date.now()) {
      await prisma.oTP.delete({
        where: {
          email: email
        }
      })
      throw Error("Code has expired. Request for a new one.")
    }

    // if not expired verify value
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await verifyHashedData(otp, hashedOTP);

    return validOTP

  } catch (error) {
    throw error
  }
}

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

    console.log("Hashed OTP:", hashedOTP);

    const createdOTPInRecord = await prisma.oTP.create({
      data: {
        otp: hashedOTP,
        email,
        createdAt: new Date(), 
        expiresAt: new Date(Date.now() + 3600000 * +duration),
      },
    });

    console.log("Created OTP record:", createdOTPInRecord);

    return createdOTPInRecord
    
    }
  catch (error) {
    throw error
  }
};


const deleteOTP = async(email) => {
  try {
    await prisma.oTP.delete({
      where: {
        email: email
      }
    })
  } catch (error) {
    throw error
  }
}


module.exports = { sendOTP, verifyingOTP, deleteOTP }




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
