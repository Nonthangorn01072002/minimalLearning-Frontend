import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Navbar from "./components/Navbar";
import useAuthStore from "./store/authStore";
import Register from "./pages/register/Register";
const App: React.FC = () => {
  const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/course" replace />} />
        <Route path="/course" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
