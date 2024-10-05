import { authenticateUser } from "../middlewares/auth.js";
import mongoose from "mongoose";
import routerModel from "../models/router.model.js";

// Function to get total number of vouchers added in a day under a specific router
export const getTotalVouchersForDay = async (req, res) => {
  const { routerId } = req.params;
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const aggregationPipeline = [
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
            $gte: startOfToday,
            $lt: endOfToday,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalVoucherCount: { $sum: "$vouchers.count" },
          totalCost: { $sum: "$vouchers.cost" },
        },
      },
    ];

    const result = await routerModel.aggregate(aggregationPipeline);
    if (!result || result.length === 0) {
      return res.status(200).json({ totalVoucherCount: 0, totalCost: 0 });
    }

    return res.status(200).json({
      totalVoucherCount: result[0].totalVoucherCount,
      totalCost: result[0].totalCost,
    });
  } catch (error) {
    console.error("Error getting total voucher count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
