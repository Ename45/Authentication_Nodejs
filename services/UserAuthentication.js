const validator = require("validator");
const { createNewUser, findUserByEmail } = require('../repositories/UserRepository');
// const passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!.@#&()–{}:;',?/*~$^+=<>]){5,20}$";
// const emailRegex = "^(?=.{1,64}@)[\\p{L}0-9+_-]+(\\.[\\p{L}0-9+_-]+)*@[^-][\\p{L}0-9+-]+(\\.[\\p{L}0-9+-]+)*(\\.\\p{L}{2,})$";


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

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signUp,
};






const checkInputFieldsNotEmpty = (firstName, lastName, email, password) => {
  if (!(firstName && lastName && email && password)) {
    throw Error("All fields are requires");
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
    throw Error("User with this email already exists. Login");
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
    throw Error("Invalid email entered");
  }
}

