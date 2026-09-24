import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ExpenseList({ refresh }) {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const expensesPerPage = 5;

  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "Debit",
    date: ""
  });

  const getExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data.expenses);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load expenses"
      );
    }
  };

  useEffect(() => {
    getExpenses();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);

      toast.success(response.data.message);

      setExpenses(
        expenses.filter((expense) => expense._id !== id)
      );

      const remainingExpenses = expenses.length - 1;
      const newTotalPages = Math.ceil(
        remainingExpenses / expensesPerPage
      );

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete expense"
      );
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditError("");

    setEditData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      type: expense.type || "Debit",
      date: expense.date.split("T")[0]
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });

    setEditError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setEditError("");

    if (!editData.title.trim()) {
      setEditError("Expense title is required");
      return;
    }

    if (!editData.amount) {
      setEditError("Amount is required");
      return;
    }

    if (Number(editData.amount) <= 0) {
      setEditError("Amount must be greater than 0");
      return;
    }

    if (!editData.type) {
      setEditError("Please select type");
      return;
    }

    if (!editData.category) {
      setEditError("Please select a category");
      return;
    }

    if (!editData.date) {
      setEditError("Date is required");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (editData.date > today) {
      setEditError("Date cannot be in the future");
      return;
    }

    try {
      const response = await api.put(
        `/expenses/${editingId}`,
        editData
      );

      setExpenses(
        expenses.map((expense) =>
          expense._id === editingId
            ? response.data.expense
            : expense
        )
      );

      setEditingId(null);
      setEditError("");

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update expense"
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" ||
      expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(
    filteredExpenses.length / expensesPerPage
  );

  const startIndex =
    (currentPage - 1) * expensesPerPage;

  const currentExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + expensesPerPage
  );

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Your Expenses
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {expenses.length} expense
          {expenses.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={handleSearchChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            No expenses found
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Try changing your search or category filter.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                      Title
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                      Category
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-slate-700">
                      Amount
                    </th>

                    <th className="text-center px-5 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentExpenses.map((expense) => {
                    const expenseType =
                      expense.type || "Debit";

                    return (
                      <tr
                        key={expense._id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        {editingId === expense._id ? (
                          <td
                            colSpan="6"
                            className="px-5 py-5"
                          >
                            <form
                              onSubmit={handleUpdate}
                              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                            >
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Title
                                </label>

                                <input
                                  type="text"
                                  name="title"
                                  value={editData.title}
                                  onChange={handleChange}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-slate-900"
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
                                  min="0"
                                  step="0.01"
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-slate-900"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Type
                                </label>

                                <select
                                  name="type"
                                  value={editData.type}
                                  onChange={handleChange}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:border-slate-900"
                                >
                                  <option value="Debit">
                                    Debit
                                  </option>

                                  <option value="Credit">
                                    Credit
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Category
                                </label>

                                <select
                                  name="category"
                                  value={editData.category}
                                  onChange={handleChange}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:border-slate-900"
                                >
                                  <option value="">
                                    Select category
                                  </option>

                                  <option value="Food">
                                    Food
                                  </option>

                                  <option value="Travel">
                                    Travel
                                  </option>

                                  <option value="Shopping">
                                    Shopping
                                  </option>

                                  <option value="Bills">
                                    Bills
                                  </option>

                                  <option value="Entertainment">
                                    Entertainment
                                  </option>

                                  <option value="Other">
                                    Other
                                  </option>
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
                                  max={new Date()
                                    .toISOString()
                                    .split("T")[0]}
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-slate-900"
                                />
                              </div>

                              <div className="md:col-span-5 flex gap-3">
                                <button
                                  type="submit"
                                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                                >
                                  Update
                                </button>

                                <button
                                  type="button"
                                  onClick={handleCancel}
                                  className="border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>

                              {editError && (
                                <p className="md:col-span-5 text-sm text-red-600">
                                  {editError}
                                </p>
                              )}
                            </form>
                          </td>
                        ) : (
                          <>
                            <td className="px-5 py-4">
                              <span className="font-medium text-slate-900">
                                {expense.title}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                {expense.category}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  expenseType === "Credit"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {expenseType}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {new Date(
                                expense.date
                              ).toLocaleDateString("en-IN")}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span
                                className={`font-bold ${
                                  expenseType === "Credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {expenseType === "Credit"
                                  ? "+"
                                  : "-"}
                                ₹
                                {Number(
                                  expense.amount
                                ).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleEdit(expense)
                                  }
                                  className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(expense._id)
                                  }
                                  className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
              <button
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentPage(index + 1)
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === index + 1
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseList;