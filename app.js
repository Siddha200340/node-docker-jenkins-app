// app.js
require("dotenv").config(); // loads environment variables from .env if running locally

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/mydb";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(`✅ Connected to MongoDB at ${mongoUrl}`)
  )
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

// Simple model for testing
const Item = mongoose.model("Item", new mongoose.Schema({
  name: String,
}));

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Node.js + MongoDB App running!");
});

app.post("/items", async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

