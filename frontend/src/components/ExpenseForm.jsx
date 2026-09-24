import { useState } from "react";
import api from "../services/api";

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "Debit",
    date: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Expense title is required");
      return;
    }

    if (!formData.amount) {
      setError("Amount is required");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.type) {
      setError("Please select type");
      return;
    }

    if (!formData.date) {
      setError("Date is required");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formData.date > today) {
      setError("Date cannot be in the future");
      return;
    }

    try {
      const response = await api.post("/expenses", formData);

      setMessage(response.data.message);

      setFormData({
        title: "",
        amount: "",
        category: "",
        type: "Debit",
        date: ""
      });

      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add expense"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Add Expense
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Record a new expense
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Expense Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Lunch"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Amount
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              ₹
            </span>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full border border-slate-300 rounded-lg pl-9 pr-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
          >
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition"
        >
          Add Expense
        </button>
      </form>

      {error && (
        <p className="mt-4 bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 text-sm text-center">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-4 bg-green-50 border border-green-100 text-green-600 rounded-lg px-4 py-3 text-sm text-center">
          {message}
        </p>
      )}
    </div>
  );
}

export default ExpenseForm;