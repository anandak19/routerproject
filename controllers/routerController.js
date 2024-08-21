import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

// to add new router
export const addRouter = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  // check if admin or not 
  if (user.userType !== 'admin') {
    return res.status(403).json({ error: "Access Denied" });
  }

  const { dns, port, userName, password, hotspot, deviceName } = req.body;

  try {
    // Check if router exists in the router collection
    let router = await routerModel.findOne({ userName, password });

    // If router not found, add router to the collection
    if (!router) {
      const newRouter = new routerModel({
        userAdded: user._id,
        dns,
        port,
        userName,
        password,
        hotspot,
        deviceName,
      });

      router = await newRouter.save();
    }

    // Check if the user has already added this router
    const userRouter = await userModel.findOne({
      _id: user._id,
      "routers.router": router._id,
    });

    if (userRouter) {
      return res
        .status(409)
        .json({ message: "Router already exists for the user" });
    }

    // Save the router ID to the user's router array
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        $push: {
          routers: {
            router: router._id,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    // Return success response
    return res.status(201).json({ message: "Router added successfully" });
  } catch (error) {
    console.error("Error adding router:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// to get all routers of a user
export const getRouterByUserId = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  const routers = user.routers;
  const userWithRouters = await userModel
    .findById(user._id)
    .populate("routers.router");

  try {
    if (!userWithRouters || userWithRouters.routers.length === 0) {
      return res
        .status(404)
        .json({ message: "No routers found for this user" });
    }

    return res.status(200).json(userWithRouters.routers);
  } catch (error) {
    console.error("Error fetching routers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// to delete a router 
export const deleteOneRouter = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  const { routerId } = req.params;

  try {
    const routerObjectId = mongoose.Types.ObjectId.createFromHexString(routerId)
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        $pull: { routers: { router: routerObjectId } }, 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const routerExists = updatedUser.routers.some(
      (r) => r.router.toString() === routerId
    );
    if (routerExists) {
      return res
        .status(404)
        .json({ message: "Router not found or not deleted" });
    }

    return res.status(200).json({ message: "Router deleted successfully" });
  } catch (error) {
    console.error("Error deleting router:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};