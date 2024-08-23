import { authenticateUser } from "../middlewares/auth.js";
import routerModel from "../models/router.model.js";

// to add new voucher to the router
export const addVoucherToRouter = async (req, res) => {
  const authResult = await authenticateUser(req, res);
  if (authResult.status !== 200) {
    return res.status(authResult.status).json(authResult.response);
  }

  const { user } = authResult;
  const { routerId } = req.params;
  const { voucherNumber, profile, phoneNumber = undefined } = req.body;

  const daysMatch = profile.match(/^(\d+)-D$/);
  if (!daysMatch) {
    return res.status(400).json({ message: "Profile format is incorrect" });
  }

  const daysToAdd = parseInt(daysMatch[1], 10);

  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysToAdd);

  const voucherData = {
    voucherNumber,
    profile,
    phoneNumber: phoneNumber || null,
    addedDate: new Date(),
    expiryDate: expiryDate.toISOString(),
    userAdded: user._id,
  };

  try {
    const updatedRouter = await routerModel.findByIdAndUpdate(
      routerId,
      { $push: { vouchers: voucherData } },
      { new: true }
    );

    if (!updatedRouter) {
      return res.status(404).json({ message: "Router not found" });
    }

    return res.status(200).json({ message: "Voucher added successfully" });
  } catch (error) {
    console.error("Error adding voucher:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
