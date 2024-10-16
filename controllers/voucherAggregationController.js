import { authenticateUser } from "../middlewares/auth.js";
import mongoose from "mongoose";
import routerModel from "../models/router.model.js";

// Function to get total number of vouchers added in a day under a specific router
export const getTotalVouchersForDay = async (req, res) => {
  const { routerId } = req.params;
  const { period } = req.query;
  let startDate, endDate;

  try {
    const now = new Date();

    switch (period) {
      case "day":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); 
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999); 
        break;

      case "week":
        const currentDayOfWeek = now.getUTCDay();
        startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - currentDayOfWeek));
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + (6 - currentDayOfWeek)));
        endDate.setUTCHours(23, 59, 59, 999);
        break;

      case "thisMonth":
        startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
        endDate.setUTCHours(23, 59, 59, 999);
        break;

      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;

      default:
        return res.status(400).json({ error: "Invalid period parameter" });
    }

    // Aggregation pipeline for total cost
    const aggregationPipeline = [
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(routerId),
        },
      },
      {
        $project: {
          vouchers: 1,
        },
      },
      {
        $unwind: "$vouchers",
      },
      {
        $match: {
          "vouchers.addedDate": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$vouchers.cost" },
        },
      },
    ];
    
    

    // Aggregation pipeline for profile-wise count
    const aggregationPipelineProfile = [
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(routerId),
        },
      },
      {
        $unwind: "$vouchers",
      },
      {
        $match: {
          "vouchers.addedDate": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$vouchers.profile",
          totalVoucherCountByProfile: { $sum: "$vouchers.count" },
        },
      },
    ];
    

    const [result, profileResult] = await Promise.all([
      routerModel.aggregate(aggregationPipeline),
      routerModel.aggregate(aggregationPipelineProfile),
    ]);

    if (!result || result.length === 0) {
      return res.status(200).json({
        totalCost: 0,
        totalVoucherCountByProfile: [],
      });
    }

    return res.status(200).json({
      totalCost: result[0].totalCost,
      totalVoucherCountByProfile: profileResult,
    });
  } catch (error) {
    console.error("Error getting total voucher count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

