import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Swal from "sweetalert2";

const Navbar: React.FC = () => {
  const token = useAuthStore((state: { token: any }) => state.token);
  const username = useAuthStore((state: { username: any }) => state.username);
  const clearAuth = useAuthStore((state: { clearAuth: any }) => state.clearAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const GO_BACK_PATH = "/login";
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearAuth();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }
      Swal.fire({
        title: "Login success",
        icon: "success",
      });
      navigate(GO_BACK_PATH);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/course">Minimal Learning</Link>
      </div>
      <div>
        {!token && (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
        {token && (
          <div className="flex items-center space-x-4">
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
