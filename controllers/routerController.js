import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import routerModel from "../models/router.model.js";
dotenv.config();

export const addRouter = async (req, res) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Access denied!" });
    }

    // check end date
    const currentDate = new Date();
    const endDate = new Date(user.endDate);
    if (currentDate > endDate) {
      return res.status(403).json({ error: "Account Expired" });
    }
    const { dns, port, userName, password, hotspot, deviceName } = req.body;

    const newRouter = new routerModel({
      userId,
      dns,
      port,
      userName,
      password,
      hotspot,
      deviceName,
    });
    console.log(newRouter);
    
    await newRouter.save();
    res.status(201).json({ message: "Router added successfully" });
  } catch (error) {
    console.error("Error adding router:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
