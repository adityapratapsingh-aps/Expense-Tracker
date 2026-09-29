const express = require("express");

const {
  getUsers,
  blockUser,
  unblockUser,
  resetUserPassword
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getUsers
);

router.patch(
  "/users/:id/block",
  authMiddleware,
  authorizeRoles("admin"),
  blockUser
);

router.patch(
  "/users/:id/unblock",
  authMiddleware,
  authorizeRoles("admin"),
  unblockUser
);

router.patch(
  "/users/:id/reset-password",
  authMiddleware,
  authorizeRoles("admin"),
  resetUserPassword
);

module.exports = router;