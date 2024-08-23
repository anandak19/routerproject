import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  voucherNumber: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    default: null,
  },
  addedDate: {
    type: Date,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  userAdded: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null, 
  },
});

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
  vouchers: [voucherSchema]
});

export default mongoose.model("Router", routerSchema);
