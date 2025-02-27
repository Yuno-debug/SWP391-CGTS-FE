import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Component/MainLayout.jsx";
import HomePage from "./Component/HomePage/HomePage";
import MemPage from "././Component/MemPage/MemPage";
// import Search from "././Component/Search/Search";
import LoginPage from "././Component/LoginPage/Login.jsx";
import SignUp from "././Component/SignUp/Signup.jsx";
import React, { useState } from 'react';
import MembershipPage from "./Component/Membership/MembershipPage/MembershipPage.jsx";
import About from "./Component/Features/About.jsx"; // Import the About component
import Profile from "./Component/ProfilePage/Profile.jsx"; // Import the Profile component
import AddChild from "./Component/MemPage/AddChild.jsx";
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
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        <Route path="/MemPage" element={<MemPage />} /> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/membership" element={<MembershipPage prices={prices} />} /> 
        <Route path="/profile" element={<Profile />} /> {/* Add route for Profile */}
        <Route path="/about" element={<About />} /> {/* Add the About route */}
        <Route path="/add-child" element={<AddChild/>} />
      </Routes>
    </Router>
  );
};

export default App;
