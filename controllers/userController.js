import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
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
  const { email, password } = req.body;

  try {
    const userData = await userModel.findOne({ email });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // check accessExpiryDate
    const currentDate = new Date();
    const accessExpiryDate = new Date(userData.accessExpiryDate);
    if (currentDate > accessExpiryDate) {
      return res.status(403).json({ error: "Account Expired" });
    }

    const userName = userData.userName;

    const token = jwt.sign(
      { id: userData._id, userName },
      process.env.SECRET_KEY,
      {
        expiresIn: "96h",
      }
    );
    res.status(200).json({ userName, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
