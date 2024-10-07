import { authenticateUser } from "../middlewares/auth.js";
import mongoose from "mongoose";
import routerModel from "../models/router.model.js";

// Function to get total number of vouchers added in a day under a specific router
export const getTotalVouchersForDay = async (req, res) => {
  const { routerId } = req.params;

  try {

    // Change this and test it for :  day wise, week wise, this motnth wise and (last month wise)
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);



    // Aggregation pipeline for total cost
    const aggregationPipeline = [
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(routerId),
          "vouchers.addedDate": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $unwind: "$vouchers",
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
          "vouchers.addedDate": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $unwind: "$vouchers",
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

