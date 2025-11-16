/** @format */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // ✅ add this
const ms = require("ms");

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true, minlength: 6 },
//     name: { type: String },
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//   },
//   { timestamps: true }
// );

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  name: { type: String },
  provider: { type: String, default: "credentials" }, // "credentials" or "google"
  googleId: { type: String }, // optional
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// helper for login
userSchema.methods.correctPassword = function (candidate, hash) {
  return bcrypt.compare(candidate, hash);
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresIn = process.env.RESET_TOKEN_EXPIRES_IN
    ? ms(process.env.RESET_TOKEN_EXPIRES_IN)
    : 60 * 60 * 1000; // fallback 1 hour

  this.resetPasswordExpires = Date.now() + expiresIn;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
