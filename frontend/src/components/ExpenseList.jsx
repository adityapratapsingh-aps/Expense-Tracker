import { useEffect, useState } from "react";
import api from "../services/api";

function ExpenseList({ refresh }) {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  const getExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data.expenses);
    } catch (error) {
      setMessage("Failed to load expenses");
    }
  };

  useEffect(() => {
    getExpenses();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);

      setMessage(response.data.message);

      setExpenses(
        expenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete expense"
      );
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setEditData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split("T")[0]
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `/expenses/${editingId}`,
        editData
      );

      setMessage(response.data.message);

      setExpenses(
        expenses.map((expense) =>
          expense._id === editingId
            ? response.data.expense
            : expense
        )
      );

      setEditingId(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update expense"
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Your Expenses
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {expenses.length} expense
            {expenses.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          ₹
          {expenses
            .reduce((total, expense) => total + Number(expense.amount), 0)
            .toLocaleString("en-IN")}
        </div>
      </div>

      {message && (
        <p className="mb-4 text-sm text-center text-green-600">
          {message}
        </p>
      )}

      {expenses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            No expenses yet
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Add your first expense using the form.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              {editingId === expense._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Expense Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      value={editData.category}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    >
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                      <option value="Entertainment">
                        Entertainment
                      </option>
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
                      value={editData.date}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition"
                    >
                      Update Expense
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {expense.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {expense.category}
                        </span>

                        <span className="text-sm text-slate-500">
                          {new Date(
                            expense.date
                          ).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <p className="text-xl font-bold text-slate-900">
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;