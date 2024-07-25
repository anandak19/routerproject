import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
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
      accessStartDate: {
        type: String,
        required: false,
      },
      accessExpiryDate: {
        type: String,
        required: false,
      }
    },
    { collection: "users" }
  );
  
  export default mongoose.model("User", userSchema);