import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";

// to add new router 
export const addRouter = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  const { dns, port, userName, password, hotspot, deviceName } = req.body;

  try {
    const newRouter = new routerModel({
      userId: user._id,
      dns,
      port,
      userName,
      password,
      hotspot,
      deviceName,
    });

    await newRouter.save();
    res.status(201).json({ message: "Router added successfully" });
  } catch (error) {
    console.error("Error adding router:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// to get all routers of a user
export const getRouterByUserId = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;

  try {

    const routers = await routerModel.find({ userId: user._id });
    if (routers.length > 0) {
      return res.status(200).json(routers);
    } else {
      return res.status(404).json({ message: "No routers found for this user" });
    }

  } catch (error) {
    console.error("Error fetching routers:", error);
    return res.status(500).json({ error: "Internal server error" }); 
  }
};
