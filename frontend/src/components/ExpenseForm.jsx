import { useState } from "react";
import api from "../services/api";

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/expenses", formData);

      setMessage(response.data.message);

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: ""
      });

      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add expense"
      );
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Expense title"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Add Expense
        </button>
      </form>

      {message && (
        <p className="text-center mt-4">
          {message}
        </p>
      )}
    </div>
  );
}

export default ExpenseForm;