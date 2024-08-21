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
      startDate: {
        type: String,
        required: false,
      },
      endDate: {
        type: String,
        required: false,
      },
      userType: {
        type: String,
        default: null
      },
      routers: [
        {
          router: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Router'
          },
          addedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
    }
  );
  
  export default mongoose.model("User", userSchema);