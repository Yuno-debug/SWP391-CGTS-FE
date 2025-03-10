import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "./InputField";
import "./Login.css";
import { AuthContext } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName, setUserId } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/UserAccount/login`,
        { userName: formData.username.trim(), password: formData.password.trim() },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log("✅ Login successful:", response.data);
      
      // Lưu token, username, userId vào localStorage
      localStorage.setItem("userId", response.data.user?.userId ?? "");
      localStorage.setItem("username", response.data.user?.username ?? "");
      localStorage.setItem("token", response.data.token ?? "");

      // Cập nhật context
      setIsLoggedIn(true);
      setUserName(response.data.user?.username || "");
      setUserId(response.data.user?.userId || "");

      navigate("/mempage");
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Invalid username or password.");
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
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
      </form>
    </div>
  );
};

export default Login;