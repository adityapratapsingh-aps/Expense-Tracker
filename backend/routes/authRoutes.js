const express = require("express");

const {
  register,
  login,
  adminLogin,
  checkAuth,
  logout
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.get("/check", authMiddleware, checkAuth);

router.post("/logout", logout);

module.exports = router;