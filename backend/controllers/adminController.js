const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            users,
            currentPage: page,
            totalPages,
            totalUsers
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User blocked successfully",
            user
        });
    } catch (error) {
        console.error("Block user error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User unblocked successfully",
            user
        });
    } catch (error) {
        console.error("Unblock user error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const newPassword = process.env.ADMIN_RESET_PASSWORD;

        if (!newPassword) {
            return res.status(500).json({
                message: "Admin reset password is not configured"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "User password reset successfully"
        });
    } catch (error) {
        console.error("Reset password error:", error);
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