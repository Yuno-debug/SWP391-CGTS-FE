import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Background from './Component/HomePage/Background/Background';
import Navbar from './Component/HomePage/NavBar/NavBar';
import Footer from './Component/HomePage/Footer/Footer';
import Body from './Component/HomePage/Body/Body';
import Membership from './Component/Membership/Membership';
import Login from './Component/LoginPage/Login';
import Signup from './Component/SignUp/Signup'; // Ensure Signup component is correctly imported
import AdminDashboard from './Component/AdminPage/Admin'; // Ensure AdminDashboard component is correctly imported

const AppContent = () => {
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/admin' && <Navbar />}
      <Routes>
        <Route path="/" element={<>
          <Background playStatus={playStatus} heroCount={heroCount} />
          <Body />
        </>} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/login" element={<Login />} /> {/* Route for Login */}
        <Route path="/signup" element={<Signup />} /> {/* Route for Signup */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/admin' && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
