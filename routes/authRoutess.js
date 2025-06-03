const express = require("express");
const router = express.Router();

const {
  registerUser,       
  loginUser,         
  getUserByEmail,
  getUserDetails,
  forgotPassword,
  verifyOtp,          
  resetPassword,
   loginWithOtp,
  verifyLoginOtp,
  verifyForgotOtp
} = require("../controllers/authController");

const validateUser = require("../middleware/validateUser");
const { verifyUserToken } = require("../middleware/protect");

router.post("/register", validateUser, registerUser);
router.post("/verify-otp/:email", verifyOtp);
router.post("/login", loginUser);
router.get("/user", verifyUserToken, getUserDetails);
router.get("/user/:email", verifyUserToken, getUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-otp/:email",verifyForgotOtp);
// router.patch("/reset-password/:email", resetPassword);
router.patch("/reset-password", verifyUserToken, resetPassword);

router.post("/login-user", loginWithOtp); 
router.post("/verify-login-otp/:email", verifyLoginOtp); 

module.exports = router;
