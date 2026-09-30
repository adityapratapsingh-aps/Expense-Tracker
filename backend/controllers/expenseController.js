const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
    try {
        const { title, amount, type, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const expense = await Expense.create({
            title,
            amount,
            type,
            category,
            date,
            user: req.user.userId
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });
    } catch (error) {
        console.error("Create expense error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalExpenses = await Expense.countDocuments({
            user: req.user.userId
        });

        const expenses = await Expense.find({
            user: req.user.userId
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalExpenses / limit);

        res.status(200).json({
            expenses,
            currentPage: page,
            totalPages,
            totalExpenses
        });
    } catch (error) {
        console.error("Get expenses error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, type, category, date } = req.body;

        const expense = await Expense.findOneAndUpdate(
            {
                _id: id,
                user: req.user.userId
            },
            {
                title,
                amount,
                type,
                category,
                date
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        console.error("Update expense error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Delete expense error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};