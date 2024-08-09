import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";
import userModel from "../models/user.model.js";

// to add new router
export const addRouter = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  
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
      return res.status(409).json({ message: "Router already exists for the user" });
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
  const routers = user.routers
  const userWithRouters = await userModel.findById(user._id).populate('routers.router');

  try {

    if (!userWithRouters || userWithRouters.routers.length === 0) {
      return res.status(404).json({ message: "No routers found for this user" });
    }

    return res.status(200).json(userWithRouters.routers);
  } catch (error) {
    console.error("Error fetching routers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
