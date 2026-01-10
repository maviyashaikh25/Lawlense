const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { getDashboardStats } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
// Get current user profile
router.get("/me", authMiddleware, getCurrentUser);

// Dashboard Stats
router.get("/stats", authMiddleware, getDashboardStats);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

module.exports = router;
