import userModel from "../models/user.model.js";
import { authenticateUser } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// register new user
export const registerAdmin = async (req, res) => {
  const { email, phoneNumber, userName, password } = req.body;
  
  try {
    const existingUser = await userModel.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const newUser = new userModel({
      email,
      phoneNumber,
      userName,
      password,
      startDate,
      endDate,
      userType: 'admin'
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
    const isMatch = password === userData.password;
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // check end date
    const currentDate = new Date();
    const endDate = new Date(userData.endDate);
    if (currentDate > endDate) {
      return res.status(403).json({ error: "Account Expired" });
    }

    // create a token 
    const userName = userData.userName;
    const userId = userData._id; 
    const token = jwt.sign(
      { id: userData._id, userName },
      process.env.SECRET_KEY
    );
    
    // sending username and token to frontend 
    res.status(200).json({ userId,userName, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};