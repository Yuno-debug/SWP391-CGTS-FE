import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import './Signup.css'; // Import CSS
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/UserAccount/register', { username, email, password, phoneNumber, address });

      const data = response.data;
      if (response.status !== 200) {
        throw new Error(data.message || 'Sign up failed');
      }

      alert('Sign up successful!');
      console.log('User Data:', data); // Handle data if needed
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="form-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error */}
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
