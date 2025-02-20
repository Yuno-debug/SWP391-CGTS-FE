import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Background from './././HomePage/Background/Background';
import Navbar from './././HomePage/NavBar/NavBar';
import Footer from './././HomePage/Footer/Footer';
import Body from './././HomePage/Body/Body';
import Membership from './././Membership/Membership';
import Login from './././LoginPage/Login';
import Signup from './././SignUp/Signup'; // Ensure Signup component is correctly imported
import AdminDashboard from './././AdminPage/Admin'; // Ensure AdminDashboard component is correctly imported

const MainLayout = () => {
  const location = useLocation(); // ✅ Lấy location đúng cách

  return (
    <>
      {location.pathname !== '/admin' && <Navbar />}
      <Routes>
        <Route path="/" element={<>
          <Background />
          <Body />
        </>} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/admin' && <Footer />}
    </>
  );
};

export default MainLayout;
