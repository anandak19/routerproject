import express from "express";
// import cors from "cors";

export const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to backend");
  });

// other app apis 