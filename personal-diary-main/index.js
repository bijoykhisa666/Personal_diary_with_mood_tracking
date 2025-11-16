/** @format */
// index.js

const express = require("express");
const cors = require("cors"); // Import cors
require("dotenv").config();
const connectDB = require("./db");
const diaryRoutes = require("./routes/diaryRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const passport = require("passport");
require("./config/passport");
const uploadRoutes = require("./routes/upload");


const app = express();
connectDB();

app.use(passport.initialize());

// Enable CORS for all routes
app.use(cors()); // Add this line before other middleware


app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes); // signup & login
app.use("/api/diary", authMiddleware, diaryRoutes);

app.use("/api/upload-image", uploadRoutes);

app.get("/", (_, res) => res.send("Personal Diary API"));
app.listen(3000, () => console.log("🚀  http://localhost:3000"));
