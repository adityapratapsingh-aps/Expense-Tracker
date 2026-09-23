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

const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    await Expense.deleteOne({
      _id: req.params.id
    });

    res.status(200).json({
      message: "Expense deleted successfully"
    });
  } catch (error) {
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