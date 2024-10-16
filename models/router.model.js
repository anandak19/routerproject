import mongoose from "mongoose";
import { generateDefaultProfiles } from "../utils/profileUtils.js";

// Voucher schema
const voucherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  profile: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    default: null,
  },
  addedDate: {
    type: Date,
    default: null,
  },
});

voucherSchema.index({ addedDate: 1, profile: 1 });

// Router schema
const routerSchema = new mongoose.Schema({
  userAdded: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  dns: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hotspot: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  vouchers: [voucherSchema],
  profiles: {
    type: Map,
    of: Number,
    default: generateDefaultProfiles,
  },
});

routerSchema.index({ _id: 1, "vouchers.addedDate": 1 });

export default mongoose.model("Router", routerSchema);
