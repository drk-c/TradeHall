const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/tradehall";

mongoose.connect(mongoURI)
  .then(() => {
    console.log(" MongoDB connected");
    app.get("/api/health", (req, res) => {
      res.json({ status: "Backend running with Docker!" });
    });
    const PORT = 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`server running on http://0.0.0.0:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
