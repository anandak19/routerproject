import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to backend");
  });
  
app.use("/api", userRoutes)