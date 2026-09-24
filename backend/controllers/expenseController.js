const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Expense title is required"
      });
    }

    if (amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required"
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Type is required"
      });
    }

    if (!["Credit", "Debit"].includes(type)) {
      return res.status(400).json({
        message: "Type must be Credit or Debit"
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const expenseDate = new Date(date);

    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date"
      });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (expenseDate > today) {
      return res.status(400).json({
        message: "Date cannot be in the future"
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title: title.trim(),
      amount: Number(amount),
      category,
      type,
      date: expenseDate
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
    const { title, amount, category, type, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Expense title is required"
      });
    }

    if (amount === undefined || amount === "") {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required"
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Type is required"
      });
    }

    if (!["Credit", "Debit"].includes(type)) {
      return res.status(400).json({
        message: "Type must be Credit or Debit"
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const expenseDate = new Date(date);

    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date"
      });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (expenseDate > today) {
      return res.status(400).json({
        message: "Date cannot be in the future"
      });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    expense.title = title.trim();
    expense.amount = Number(amount);
    expense.category = category;
    expense.type = type;
    expense.date = expenseDate;

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