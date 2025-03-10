import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Background from './HomePage/Background/Background';
import Navbar from './HomePage/NavBar/NavBar';
import NavbarLogin from './MemPage/NavBarLogin';
import Footer from './HomePage/Footer/Footer';
import Body from './HomePage/Body/Body';
import Membership from './Membership/MembershipPage/MembershipPage';
import MemPage from './MemPage/MemPage';
import Login from './LoginPage/Login';
import Signup from './SignUp/Signup';
import AdminDashboard from './AdminPage/Admin';
import AddChild from './MemPage/AddChild';
import Doctor from './Doctor/Doctor';

const MainLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Xác định các trang không cần Navbar và Footer
  const hideNavAndFooter = location.pathname === '/admin' || location.pathname === '/doctor';

  return (
    <>
      {!hideNavAndFooter && (isLoggedIn ? <NavbarLogin /> : <Navbar />)}

      {/* Bọc toàn bộ nội dung trong một div */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<>
            <Background />
            <Body />
          </>} />
          <Route path="/mempage" element={isLoggedIn ? <MemPage /> : <Navigate to="/login" />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/doctor" element={<Doctor />} />
        </Routes>
      </div>

      {!hideNavAndFooter && <Footer />}
    </>
  );
};

export default MainLayout;
