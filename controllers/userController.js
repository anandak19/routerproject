import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// register new user
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
    const accessStartDate = new Date();
    const accessExpiryDate = new Date(accessStartDate);
    accessExpiryDate.setFullYear(accessExpiryDate.getFullYear() + 1);

    const newUser = new userModel({
      email,
      phoneNumber,
      userName,
      password: hashedPassword,
      accessStartDate,
      accessExpiryDate,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// login user
export const loginUser = async (req, res) => {
  
};
