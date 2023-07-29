const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
const { createNewUser, findUserByEmail, } = require("../repositories/UserRepository");
const { verifyHashedData } = require("../utils/HashData");
const { sendVerificationOTPEmail } = require('../repositories/EmailVerificationRepository')
const createJwtToken = require("../helper/GetJwtToken");
require("dotenv").config;


const signUp = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();

    checkInputFieldsNotEmpty(firstName, lastName, email, password);
    await validateEmail(email);
    validatePassword(password);
    await checkUserIsNotRegisteredAlready(email);


    const newUser = await registerUser(firstName, lastName, email, password);

    await sendVerificationOTPEmail(email)
    
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("All fields are required");
    }

    const foundUser = await checkUserIsSignedUp(email);

    if (!foundUser.verified) {
      throw Error("Your Email has not been verified yet. Check your email")
    }

    await checkPasswordMatchesUserInDatabase(password, foundUser);
    await generateJwtToken(foundUser, email);

    res.status(200).json(foundUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signUp,
  login,
};

const checkInputFieldsNotEmpty = (firstName, lastName, email, password) => {
  if (!(firstName && lastName && email && password)) {
    throw Error("All fields are requires");
  }
};

async function checkUserIsSignedUp(email) {
  const foundUser = await findUserByEmail(email);

  if (!foundUser) {
    throw Error("This email does not match an account");
  }
  return foundUser;
}

async function generateJwtToken(foundUser, email) {
  const tokenData = { userId: foundUser._id, email };
  const token = await createJwtToken(tokenData);
  foundUser.token = token;
}

async function checkPasswordMatchesUserInDatabase(password, foundUser) {
  const isPasswordMatch = await verifyHashedData(password, foundUser.password);
  if (!isPasswordMatch) {
    throw Error("incorrect password");
  }
}

async function registerUser(firstName, lastName, email, password) {
  return await createNewUser({
    firstName,
    lastName,
    email,
    password,
  });
}

async function checkUserIsNotRegisteredAlready(email) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw Error("User with this email already exists");
  }
}

function validatePassword(password) {
  if (password.length < 5) {
    throw Error("Password must be at least 5 characters long.");
  }
}

async function validateEmail(email) {
  const isEmail = await validator.isEmail(email);
  if (!isEmail) {
    throw Error("Invalid email address");
  }
}




// const signUp = async (req, res) => {
//   try {
//     let { firstName, lastName, email, password } = req.body;
//     firstName = firstName.trim();
//     lastName = lastName.trim();
//     email = email.trim();
//     password = password.trim();

//     checkInputFieldsNotEmpty(firstName, lastName, email, password);
//     await validateEmail(email);
//     validatePassword(password);
//     await checkUserIsNotRegisteredAlready(email);

//     const otp = generateOTP();


//     const storedOTP = await prisma.oTP.create({
//         data: {
//           otp: otp,
//           expiresAt: new Date(Date.now() + 3 * 60 * 1000), 
//         },
//       });
//       console.log("Stored OTP: ", storedOTP);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: process.env.AUTH_EMAIL,
//       to: email,
//       subject: "OTP Verification for App Registration",
//       text: `Congratulations! Your OTP is ${storedOTP.otp} and it expires in ${storedOTP.expiresAt}`,
//     };

//     transporter.sendMail(mailOptions, async (error, info) => {
//       if (error) {
//         console.log("Error sending email:", error);
//         return res.status(500).json({ error: "Failed to send OTP email" });
//       }

//       console.log("Email sent: ", otp);


//       // Store the OTP and user details in the OTP model for OTP verification


//       return res.json({ message: "OTP sent successfully" });
//     });
//   } catch (error) {
//     console.log("Error during registration: ", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const signUp = async (req, res) => {
//   try {
//     let { firstName, lastName, email, password } = req.body;
//     firstName = firstName.trim();
//     lastName = lastName.trim();
//     profession = profession.trim();
//     email = email.trim();
//     password = password.trim();

//     checkInputFieldsNotEmpty(firstName, lastName, email, password);
//     await validateEmail(email);
//     validatePassword(password);
//     await checkUserIsNotRegisteredAlready(email);

//     const otp = generateOTP();

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.AUTH_EMAIL,
//           pass: process.env.AUTH_PASSWORD,
//         },
//         tls: {
//           rejectUnauthorized: false, 
//         },
//       });

//       const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: email,
//         subject: "OTP Verification for App Registration",
//         text: `Congratulations! Your OTP is ${otp}`
//       }

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log("Error sending email:", error);
//           return res.status(500).json({ error: 'Failed to send OTP email' });
//         }

//     console.log("Email sent: ", otp);

//     prisma.oTP.create({
//       data: {
//         email,
//         otp,
//         expiresAt: new Date(Date.now() + 300000)
//       }
//     })
    

//     // const tempUserData = { firstName, lastName, profession, email, password, otp, expirationTime: Date.now() + 300000 };

//     // tempUserDataMap.set(email, tempUserData)

//     return res.json({ message: "OTP send successfully" })

//   });
//   } catch (error) {
//     console.log("Error during registration: ", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// const tempUserDataMap = new Map();

// const tempUserDataMap = new Map();

// const verifyOTP = async(req, res) => {
//   const { otp } = req.body;

//   try {
//     // const tempUserData = tempUserDataMap.get(email);
//     // if (
//       //   !tempUserData ||
//       //   tempUserData.otp !== otp ||
//       //   tempUserData.expirationTime < Date.now()
//       // ) {
//         //   return res.status(400).json({ error: "Incorrect or expired OTP" });
//         // }
    
//     const storedOTP = await prisma.oTP.findFirst({
//       where: {
//         otp,
//         expiresAt: {gte: new Date()}
//       }
//     })
    
//     if (
//       !storedOTP ||
//       storedOTP.otp !== otp ||
//       storedOTP.expiresAt < Date.now()
//     ) {
//       return res.status(400).json({ error: "Incorrect or expired OTP" });
//     }
//     // OTP is correct and valid, create the user in the main database

//     const hashedPassword = await hashedData(password, 10)

//     console.log(hashedPassword);
    
//     await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         email: userEmail,
//         password: hashedPassword,
//       },
//     });

//     // Delete the temporary user data from in-memory storage after successful registration
//     await prisma.oTP.delete({
//       where: {
//         email
//       }
//     })
//     // tempUserDataMap.delete(email);

//     return res.json({ message: "User created successfully" });

//   } catch (error) {
//     console.log("Error during OTP verification:", error);
//     return res.status(500).json({ error: "OTP verification failed" });
//   }
// }

