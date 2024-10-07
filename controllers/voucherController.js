import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";

// to add new voucher to the router
export const addVoucherData = async (req, res) => {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(req, res);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json(authResult.response);
    }

    const { user } = authResult;
    const { routerId } = req.params;
    const { userId, profile, count } = req.body;

    // Validate count
    if (!count || count <= 0) {
      return res.status(400).json({ message: "Invalid count provided" });
    }

    // Find the router by ID
    const router = await routerModel.findById(routerId);
    if (!router) {
      return res.status(404).json({ message: "Router not found" });
    }

    // Check if the profile exists in the router's profiles
    if (!router.profiles.has(profile)) {
      return res.status(400).json({ message: `Profile ${profile} not found in the router` });
    }

    // Get the profile cost for the given profile
    const profileValue = router.profiles.get(profile);
    const cost = count * profileValue;

    // Prepare the voucher data
    const voucherData = {
      userId,
      profile,
      count,
      cost,
      addedDate: new Date(),
    };

    // saving to the router 
    // Update the router by pushing the new voucher
    const updatedRouter = await routerModel.findByIdAndUpdate(
      routerId,
      { $push: { vouchers: voucherData } },
      { new: true }
    );

    if (!updatedRouter) {
      return res.status(404).json({ message: "Router not found after update" });
    }

    return res.status(200).json({ message: "Voucher details added successfully", voucherData });
    
  } catch (error) {
    console.error("Error adding voucher:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// to delete a voucher from router
export const deleteVoucherFromRouter = async (req, res) => {
  // Authenticate the user
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { routerId, voucherId } = req.params;

  try {
    const updatedRouter = await routerModel.findByIdAndUpdate(
      routerId,
      { $pull: { vouchers: { _id: voucherId } } },
      { new: true }
    );

    if (!updatedRouter) {
      return res.status(404).json({ message: "Router not found" });
    }

    return res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
