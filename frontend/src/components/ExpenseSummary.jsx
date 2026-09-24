import { useEffect, useState } from "react";
import api from "../services/api";

function ExpenseSummary({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data.expenses);
    } catch (error) {
      setExpenses([]);
    }
  };

  useEffect(() => {
    getExpenses();
  }, [refresh]);

  const totalCredit = expenses.reduce((total, expense) => {
    if (expense.type === "Credit") {
      return total + Number(expense.amount);
    }

    return total;
  }, 0);

  const totalDebit = expenses.reduce((total, expense) => {
    if (!expense.type || expense.type === "Debit") {
      return total + Number(expense.amount);
    }

    return total;
  }, 0);

  const totalOutstanding = totalCredit - totalDebit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Credit
        </p>

        <h3 className="text-2xl font-bold text-green-600 mt-2">
          +₹
          {totalCredit.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h3>
      </div>

      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Debit
        </p>

        <h3 className="text-2xl font-bold text-red-600 mt-2">
          -₹
          {totalDebit.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h3>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Outstanding
        </p>

        <h3
          className={`text-2xl font-bold mt-2 ${
            totalOutstanding >= 0
              ? "text-slate-900"
              : "text-red-600"
          }`}
        >
          {totalOutstanding >= 0 ? "+" : "-"}₹
          {Math.abs(totalOutstanding).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h3>
      </div>
    </div>
  );
}

export default ExpenseSummary;