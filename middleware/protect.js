const jwt = require("jsonwebtoken");
require("dotenv").config();

const S_KEY = process.env.JWT_SECRET;

const verifyUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log("authHeader:::::::::    ", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, S_KEY);
    req.auth = decoded; 
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyUserToken };
