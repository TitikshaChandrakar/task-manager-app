const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);   // POST /api/auth/register
router.post("/login", login);         // POST /api/auth/login

// Protected routes (require valid JWT)
router.get("/me", protect, getMe);                      // GET  /api/auth/me
router.put("/me", protect, updateMe);                   // PUT  /api/auth/me
router.put("/me/password", protect, changePassword);    // PUT  /api/auth/me/password

module.exports = router;
