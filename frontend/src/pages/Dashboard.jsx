import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Expense Tracker Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              User ID: {userId}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <ExpenseForm onExpenseAdded={handleExpenseAdded} />

        <ExpenseList refresh={refresh} />

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;