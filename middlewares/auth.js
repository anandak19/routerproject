import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const authenticateUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { status: 401, response: { message: "Authorization header is missing" } };
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return { status: 401, response: { message: "Access denied!" } };
    }

    // Check end date
    const currentDate = new Date();
    const endDate = new Date(user.endDate);
    if (currentDate > endDate) {
      return { status: 403, response: { error: "Account Expired" } };
    }

    return { status: 200, user };

  } catch (error) {
    console.error("Error in authentication:", error);
    return { status: 500, response: { error: "Internal server error" } };
  }
};
