import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// function to register new user
export const registerUser = async (req, res) => {
  const { email, phoneNumber, userName, password } = req.body;
  try {
    const existingUser = await userModel.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      phoneNumber,
      userName,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};
