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
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Your Expenses
      </h2>

      {message && (
        <p className="mb-4 text-center">
          {message}
        </p>
      )}

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white p-4 rounded-lg shadow"
          >
            {editingId === expense._id ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="number"
                  name="amount"
                  value={editData.amount}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="category"
                  value={editData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="font-bold text-lg">
                  {expense.title}
                </h3>

                <p>Amount: ₹{expense.amount}</p>
                <p>Category: {expense.category}</p>

                <p>
                  Date:{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;