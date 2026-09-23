import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Expense Tracker Dashboard
        </h1>

        <p className="mt-4">
          User ID: {userId}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;