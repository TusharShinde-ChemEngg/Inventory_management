const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({
    message: "User routes are working"
  });
});

// GET ALL TEAM MEMBERS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("name role")
        .sort({ name: 1 });

      res.status(200).json(users);
    } catch (error) {
      console.error("USERS ERROR:", error);

      res.status(500).json({
        message: "Failed to load team members",
        error: error.message
      });
    }
  }
);

module.exports = router;