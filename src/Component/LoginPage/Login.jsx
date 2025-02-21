import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import "./Login.css"; // Import CSS
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5200/api/UserAccount/login",
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Needed if using cookies for auth
      }
    );

    console.log("Login successful:", response.data);
    alert('Login successful!');
    navigate('/member');
  } catch (err) {
    console.error("Login Error:", err.response?.data?.message || err.message);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="login-container">
      <h2 className="form-title">Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error */}

      <form onSubmit={handleSubmit} className="login-form">
        <InputField
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a href="#" className="forgot-password-link">
          Forgot password?
        </a>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="signup-prompt">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="signup-link">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
