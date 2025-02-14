import React from 'react';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import './Signup.css'; // Import CSS

const Signup = () => {
  return (
    <div className="signup-container">
      <h2 className="form-title">Sign Up</h2>
      <form action="#" className="signup-form">
        <InputField type="text" placeholder="Username" />
        <InputField type="email" placeholder="Email" />
        <InputField type="password" placeholder="Password" />
        <InputField type="password" placeholder="Confirm Password" />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="login-prompt">
        Already have an account? <Link to="/login" className="login-link">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
