
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received");
    console.log("Request body:", req.body);

    const pin = String(req.body.pin || "").trim();

    console.log("PIN received:", pin);

    // Validate PIN
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        message: "PIN must be exactly 4 digits",
      });
    }

    // Find user
    const user = await User.findOne({ pin: pin });

    console.log(
      "User found:",
      user ? `${user.name} (${user.role})` : "NO USER"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid PIN",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;

