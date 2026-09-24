import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";

function Dashboard() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUserId(response.data.userId);
      } catch (error) {
        navigate("/login");
      }
    };

    getProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      setMessage("Logout failed");
    }
  };

  const handleExpenseAdded = () => {
    setRefresh(refresh + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Expense Tracker
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your expenses easily
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Welcome back
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Your Expenses
          </h2>
        </div>

        <ExpenseSummary refresh={refresh} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <ExpenseForm
              onExpenseAdded={handleExpenseAdded}
            />
          </div>

          <div className="lg:col-span-2">
            <ExpenseList refresh={refresh} />
          </div>
        </div>

        {message && (
          <p className="mt-6 text-center text-red-600">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;