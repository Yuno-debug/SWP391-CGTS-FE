import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from './InputField';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log("Sending request with:", { username, email, password, confirmPassword, phoneNumber, address });

    if (!username || !email || !password || !confirmPassword || !phoneNumber || !address) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5200';

    try {
      const response = await axios.post(`${API_URL}/api/UserAccount/register`, 
        { username, email, password, confirmPassword, phoneNumber, address }, 
        { headers: { "Content-Type": "application/json" } });

      console.log("API Response:", response); // Debugging  

      if (response.status === 200) {
        alert('Sign up successful!');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="form-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <InputField type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <InputField type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="login-prompt">
        Already have an account? <Link to="/login" className="login-link">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
