/** @format */

const express = require("express");
const router = express.Router();
const { signup, login, getUsers, forgotPassword, resetPassword,googleLogin } = require("../controllers/authController");

const passport = require("passport");
const jwt = require("jsonwebtoken");

// Redirect to Google for login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// ========================================
// 2. Google OAuth (NextAuth API Call)
// ========================================
router.post("/google/callback", googleLogin); // <-- NEW: POST for NextAuth

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUsers);

// Forgot / Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
