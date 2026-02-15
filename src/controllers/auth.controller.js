const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  const { username, email, password, adminKey } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExist) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let role = "user";

  if (adminKey === process.env.ADMIN_KEY) {
    role = "admin";
  }

  const user = await User.create({
    // create method is used to create a new user in the database, if only
    username,
    email,
    password: hashedPassword,
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  ); // sign method is used to create a new token
  // role is added to the token to identify the role of the user (admin or user) and to implement role-based access control in the future
  res.cookie("token", token);
  console.log("this is token generated after registration", token); // Log the generated token to verify that it is being created correctly

  res.status(201).json({
    message: "User registered successfully",
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials , user not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials , password is incorrect",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
};
