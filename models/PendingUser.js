const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String,
     unique: true
     },
  password: String,
  mobile: String,
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
