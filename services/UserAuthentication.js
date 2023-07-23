const validator = require("validator");
const { createNewUser, findUserByEmail } = require('../repositories/UserRepository');
const passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!.@#&()–{}:;',?/*~$^+=<>]){5,20}$";
const emailRegex = "^(?=.{1,64}@)[\\p{L}0-9+_-]+(\\.[\\p{L}0-9+_-]+)*@[^-][\\p{L}0-9+-]+(\\.[\\p{L}0-9+-]+)*(\\.\\p{L}{2,})$";

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!(name && email && password)) {
      throw Error("All fields are requires");
    }

    const isEmailMatch = await validator.matches(email, emailRegex);
    if (!isEmailMatch) {
      throw Error("Invalid email entered");
    }

    const isPasswordMatch = await validator.matches(password, passwordRegex);
    if (!isPasswordMatch) {
      throw Error("Password must be at least 5 characters long.");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw Error("User with this email already exists. Login");
    }

    const newUser = createNewUser({
      name,
      email,
      password,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signUp,
};
