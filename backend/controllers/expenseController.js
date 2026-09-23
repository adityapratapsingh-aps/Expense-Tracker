const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id
    }).sort({ date: -1 });

    res.status(200).json({
      expenses
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createExpense,
  getExpenses
};