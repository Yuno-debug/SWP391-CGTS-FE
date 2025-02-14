import React from 'react';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import './Login.css'; // Import CSS

const Login = () => {
  return (
    <div className="login-container">
      <h2 className="form-title">Login</h2>
      <form action="#" className="login-form">
        <InputField type="text" placeholder="Username" />
        <InputField type="password" placeholder="Password" />
        <a href="#" className="forgot-password-link">Forgot password?</a>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;