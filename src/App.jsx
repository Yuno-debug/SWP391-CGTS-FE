import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Component/MainLayout.jsx";
import HomePage from "./Component/HomePage/HomePage";
import MemPage from "./Component/MemPage/MemPage";
import LoginPage from "./Component/LoginPage/Login.jsx";
import SignUp from "./Component/SignUp/Signup.jsx";
import MembershipPage from "./Component/Membership/MembershipPage/MembershipPage.jsx";
import About from "./Component/Features/About.jsx";
import Profile from "./Component/ProfilePage/Profile.jsx";
import AddChild from "./Component/MemPage/AddChild.jsx";
import { AuthProvider } from "./Component/LoginPage/AuthContext";

const App = () => {
  const [prices, setPrices] = useState({
    free: '$0',
    basic: '$9.99 / month',
    premium: '$99.99 / month',
  });

  const handlePriceChange = (packageType, newPrice) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [packageType]: newPrice,
    }));
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
          <Route path="/MemPage" element={<MemPage />} /> 
          <Route path="/" element={<HomePage />} /> 
          <Route path="/membership" element={<MembershipPage prices={prices} />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/add-child" element={<AddChild />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
