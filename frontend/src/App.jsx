import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import api from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/check");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Login onLogin={setUser} />
            )
          }
        />

        <Route
          path="/admin/login"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <AdminLogin onLogin={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              user={user}
              allowedRole="user"
            >
              <Dashboard
                onLogout={() => setUser(null)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              user={user}
              allowedRole="admin"
            >
              <AdminDashboard
                onLogout={() => setUser(null)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;