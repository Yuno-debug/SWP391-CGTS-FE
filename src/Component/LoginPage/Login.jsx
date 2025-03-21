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

      if (!response.data.success || !response.data.user) {
        throw new Error("Invalid response format or no user data received.");
      }

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("userId", user?.userId ?? "");
      localStorage.setItem("username", user?.username ?? "");
      localStorage.setItem("role", user?.role ?? "");
      localStorage.setItem("token", token ?? "");

      setIsLoggedIn(true);
      setUserName(user?.username || "");
      setUserId(user?.userId || "");

      switch (user?.role) {
        case 1:
          navigate("/admin");
          break;
        case 3:
          navigate("/doctor");
          break;
        case 2:
          navigate("/mempage");
          break;
        default:
          navigate("/");
      }
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
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;