import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await api.post("/auth/login", formData);

      setMessage(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20"></div>

      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-32 -right-32"></div>

      <div className="w-full max-w-6xl relative">
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">

          <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-12 text-white flex-col justify-between overflow-hidden">

            <div className="absolute w-64 h-64 rounded-full border border-white/10 -right-24 -top-24"></div>

            <div className="absolute w-80 h-80 rounded-full border border-white/10 -left-40 -bottom-40"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-900 text-xl font-bold shadow-lg">
                  ₹
                </div>

                <div>
                  <h1 className="text-xl font-bold">
                    Expense Tracker
                  </h1>

                  <p className="text-xs text-slate-400">
                    Personal finance manager
                  </p>
                </div>
              </div>

              <div className="mt-28">
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
                  Welcome back
                </p>

                <h2 className="text-5xl font-bold leading-tight">
                  Your money.
                  <br />
                  Your control.
                </h2>

                <p className="text-slate-400 mt-6 leading-7 max-w-md">
                  Keep track of your expenses, understand your
                  spending and stay organized with a simple
                  personal expense manager.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-12 max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl">₹</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Track
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl">✓</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Manage
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl">↗</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Improve
                  </p>
                </div>
              </div>
            </div>

            <p className="relative z-10 text-sm text-slate-500">
              Simple. Organized. Personal.
            </p>
          </div>

          <div className="flex items-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md mx-auto">

              <div className="lg:hidden flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  ₹
                </div>

                <div>
                  <h1 className="font-bold text-slate-900">
                    Expense Tracker
                  </h1>

                  <p className="text-xs text-slate-500">
                    Personal finance manager
                  </p>
                </div>
              </div>

              <div className="mb-9">
                <p className="text-blue-600 font-semibold text-sm mb-3">
                  SIGN IN
                </p>

                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Welcome back
                </h2>

                <p className="text-slate-500 mt-3">
                  Login to continue managing your expenses.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email address
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      @
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-11 pr-4 py-4 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      •
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-11 pr-14 py-4 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-900"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-slate-900/10 hover:shadow-blue-700/20 transition duration-200"
                >
                  Sign in to your account
                </button>
              </form>

              {error && (
                <div className="mt-5 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm text-center">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-5 bg-green-50 border border-green-100 text-green-600 rounded-xl px-4 py-3 text-sm text-center">
                  {message}
                </div>
              )}

              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-slate-200 flex-1"></div>

                <span className="text-xs font-medium text-slate-400">
                  OR
                </span>

                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="inline-block mt-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create a new account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;