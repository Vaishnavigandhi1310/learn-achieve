const User = require("../models/User");
const { otp, sentOtp } = require("../utils/helper");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generateToken")
const mongoose = require('mongoose')
const {
  loginUserService
} = require("../services/userService");

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, mobile } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const generatedOtp = otp(6);
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     const newUser = new User({
//       name,
//       email,
//       password,  
//       mobile,
//       otp: generatedOtp,
//       otpExpiry,
//       isVerified: false,
//     });

//     await newUser.save();

//     await sentOtp(email, generatedOtp);

//     return res.status(200).json({
//       message: "OTP sent to your email. Please verify to complete registration."
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const PendingUser = require("../models/PendingUser");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existingUser = await User.findOne({ email });
    const pendingUser = await PendingUser.findOne({ email });

    if (existingUser || pendingUser) {
      return res.status(400).json({ message: "User already exists or is pending verification" });
    }

    const generatedOtp = otp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new PendingUser({
      name,
      email,
      password,
      mobile,
      otp: generatedOtp,
      otpExpiry
    });

    await newUser.save();
    await sentOtp(email, generatedOtp);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = await loginUserService(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  const { userId } = req.auth;
  try {
    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User data", data: userData });
  } catch (error) {
    console.log("Get user error:", error);
    res.status(500).json({ message: "Request failed!", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const generatedOtp = otp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    user.otp = generatedOtp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await sentOtp(email, generatedOtp);

    return res.status(200).json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// const verifyOtp = async (req, res) => {
//   const { email } = req.params;
//   const { otp: inputOtp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.otp || !user.otpExpiry) {
//       return res.status(400).json({ message: "OTP not requested or expired" });
//     }

//     if (user.otpExpiry < new Date()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     if (user.otp !== inputOtp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!user.isVerified) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(user.password, salt);

//       user.password = hashedPassword;
//       user.isVerified = true;
//     }

//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     return res.status(200).json({ message: "OTP verified successfully." });
//   } catch (error) {
//     return res.status(500).json({ message: "Something went wrong", error: error.message });
//   }
// };


const verifyForgotOtp = async (req, res) => {
  const { email } = req.params;
  const { otp: inputOtp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP not valid or expired" });
    }

    if (user.otp !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id); 

    res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email } = req.params;
  const { otp: inputOtp } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({ message: "User not found or already verified" });
    }

    if (!pendingUser.otp || !pendingUser.otpExpiry || pendingUser.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (pendingUser.otp !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pendingUser.password, salt);

    const verifiedUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: hashedPassword,
      mobile: pendingUser.mobile,
      isVerified: true
    });

    await verifiedUser.save();
    await PendingUser.deleteOne({ email });

    return res.status(200).json({ message: "OTP verified and user registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// const resetPassword = async (req, res) => {
//   const { email } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).send({ message: "Password reset successful" });
//   } catch (error) {
//     return res.status(400).send({
//       message: "Request Failed!",
//       error: error.message || error,
//     });
//   }
// };

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { userId } = req.auth; // From token

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).send({
      message: "Request Failed!",
      error: error.message || error,
    });
  }
};

const loginWithOtp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "User not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const generatedOtp = otp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = generatedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sentOtp(email, generatedOtp);

    res.status(200).json({ message: "OTP sent to your email for verification" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const verifyLoginOtp = async (req, res) => {
  const { email } = req.params;
  const { otp: inputOtp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "OTP not generated or expired" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getAllUserTaskData = async (req,res)=>{
    // const {id} = req.params;
    try {
      let user = await User.aggregate([
        {
          $lookup:{
            from:"orders",
            localField:"_id",
            foreignField:"userId",
            as:"allData"
          }
        }
      
      ])
      res.status(200).send({message:"Success !",data:user});
    } catch (error) {
      res.status(400).send({message:"failed",data:"",error:error});
    }
    
  }

  const getLoggedInUserTaskData = async (req, res) => {
  const { userId } = req.auth;

  try {
    const userData = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }  
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }
      }
    ]);

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User not found or no data available" });
    }

    res.status(200).json({
      message: "User data ",
      data: userData[0] 
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user data",
      error: error.message
    });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUserByEmail,
  getUserDetails,
  forgotPassword,
  verifyForgotOtp,
  verifyOtp,
  resetPassword,
  loginWithOtp,
  verifyLoginOtp,
  getAllUserTaskData,
  getLoggedInUserTaskData
};
