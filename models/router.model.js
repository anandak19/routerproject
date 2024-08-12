import mongoose from "mongoose";

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
});

export default mongoose.model("Router", routerSchema);
