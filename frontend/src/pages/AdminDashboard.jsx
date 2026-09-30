import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);

      const response = await api.get(
        `/admin/users?page=${page}&limit=${limit}`
      );

      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleBlock = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/block`);
      fetchUsers(currentPage);
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleUnblock = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/unblock`);
      fetchUsers(currentPage);
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleResetPassword = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reset this user's password?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.patch(
        `/admin/users/${id}/reset-password`
      );

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      onLogout();

      navigate("/admin/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage users and account access
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">

            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Role
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked
                            ? "Blocked"
                            : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4">

                        {user.role === "admin" ? (
                          <span className="text-sm text-gray-400">
                            Admin
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">

                            {user.isBlocked ? (
                              <button
                                onClick={() =>
                                  handleUnblock(user._id)
                                }
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleBlock(user._id)
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              >
                                Block
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleResetPassword(user._id)
                              }
                              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                              Reset Password
                            </button>

                          </div>
                        )}

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>

          <div className="flex items-center justify-between border-t px-6 py-4">

            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">

              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;