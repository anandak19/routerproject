import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";
import userModel from '../models/user.model.js';
// import mongoose from 'mongoose';

// to add new voucher to the router
// export const addVoucherData = async (req, res) => {
//   const session = await mongoose.startSession(); 
//   session.startTransaction(); 

//   try {
//     // Authenticate the user
//     const authResult = await authenticateUser(req, res);
//     if (authResult.status !== 200) {
//       await session.abortTransaction(); 
//       return res.status(authResult.status).json(authResult.response);
//     }

//     const { routerId } = req.params;
//     const { userId, profile, count } = req.body;

//     // Validate count
//     if (!count || count <= 0) {
//       await session.abortTransaction();
//       return res.status(400).json({ message: "Invalid count provided" });
//     }

//     // Find the router by ID
//     const router = await routerModel.findById(routerId).session(session);
//     if (!router) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Router not found" });
//     }

//     if (!router.profiles.has(profile)) {
//       await session.abortTransaction();
//       return res.status(400).json({ message: `Profile ${profile} not found in the router` });
//     }

//     const profileValue = router.profiles.get(profile);
//     const cost = count * profileValue;

//     const voucherData = {
//       userId,
//       profile,
//       count,
//       cost,
//       addedDate: new Date(),
//     };

//     const updatedRouter = await routerModel.findByIdAndUpdate(
//       routerId,
//       { $push: { vouchers: voucherData } },
//       { new: true, session }
//     );

//     if (!updatedRouter) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Router not found after update" });
//     }

//     const user = await userModel.findOne(
//       { _id: userId, "routers.routerId": routerId },
//       { "routers.$": 1 }
//     ).session(session);
    
//     if (!user || !user.routers || user.routers.length === 0) {
//       await session.abortTransaction(); 
//       return res.status(404).json({ message: "Router not found for the user" });
//     }
    
//     // Get the current totalCost of the specific router
//     const currentRouter = user.routers[0];
//     const currentRouterCost = currentRouter.totalCost || 0;
    
//     // Calculate the updated total cost for the router
//     const updatedTotalCost = currentRouterCost + cost;
    
//     // update this code to update the specific router from the routers array , use router id for that
//     const updatedUser = await userModel.findOneAndUpdate(
//       { _id: userId, "routers.routerId": routerId }, // Find the user and the specific router by routerId
//       { $set: { "routers.$.totalCost": updatedTotalCost } }, // Use dot notation to update totalCost of the specific router
//       { new: true, session } // Return the updated document and use the session
//     );

//     if (!updatedUser) {
//       await session.abortTransaction(); 
//       return res.status(500).json({ message: "Failed to update user's total cost" });
//     }

//     await session.commitTransaction();

//     return res.status(200).json({ message: "Voucher details added successfully and total cost updated", voucherData });

//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error adding voucher:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   } finally {
//     session.endSession();
//   }
// };

export const addVoucherData = async (req, res) => {
  try {
    // Authenticate the user
    const authResult = await authenticateUser(req, res);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json(authResult.response);
    }

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

    if (!router.profiles.has(profile)) {
      return res.status(400).json({ message: `Profile ${profile} not found in the router` });
    }

    const profileValue = router.profiles.get(profile);
    const cost = count * profileValue;

    const voucherData = {
      userId,
      profile,
      count,
      cost,
      addedDate: new Date(),
    };

    // Update the router by pushing the new voucher
    const updatedRouter = await routerModel.findByIdAndUpdate(
      routerId,
      { $push: { vouchers: voucherData } },
      { new: true }
    );

    if (!updatedRouter) {
      return res.status(404).json({ message: "Router not found after update" });
    }

    // Find the user and the specific router from the user's routers array
    const user = await userModel.findOne(
      { _id: userId, "routers.router": routerId },
      { "routers.$": 1 }
    );

    if (!user || !user.routers) {
      return res.status(404).json({ message: "Router not found for the user" });
    }

    // Get the current totalCost of the specific router
    const currentRouter = user.routers[0];
    const currentRouterCost = currentRouter.totalCost || 0;

    // Calculate the updated total cost for the router
    const updatedTotalCost = currentRouterCost + cost;

    // Update the specific router's totalCost in the user's routers array
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId, "routers.router": routerId },
      { $set: { "routers.$.totalCost": updatedTotalCost } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user's total cost" });
    }

    return res.status(200).json({ message: "Voucher details added successfully and total cost updated", voucherData });

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
