const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be blocked"
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      message: "User restricted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({
      message: "User restriction removed successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin password cannot be reset"
      });
    }

    if (!process.env.ADMIN_RESET_PASSWORD) {
      return res.status(500).json({
        message: "Admin reset password is not configured"
      });
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_RESET_PASSWORD,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "User password reset successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getUsers,
  blockUser,
  unblockUser,
  resetUserPassword
};