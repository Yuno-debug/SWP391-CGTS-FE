import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "./InputField";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const mapRoleToString = (role) => {
  switch (role) {
    case 1: return "admin";
    case 2: return "member";
    default: return "guest";
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/api/UserAccount/login`, {
      userName: formData.username.trim(),
      password: formData.password.trim(),
    });

    console.log("✅ Login successful:", response.data);

    const roleString = mapRoleToString(response.data.role);
    
    // 🛠 Sửa lại: Lưu userId từ `response.data.user.userId`
    localStorage.setItem("userId", response.data.user.userId);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", roleString);

    navigate(roleString === "admin" ? "/admin" : "/mempage");

  } catch (err) {
    console.error("❌ Login Error:", err);
    setError("Invalid username or password.");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="login-container">
      <h2 className="form-title">Login</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <InputField type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

        <a href="#" className="forgot-password-link">Forgot password?</a>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="signup-prompt">
        Don&apos;t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
