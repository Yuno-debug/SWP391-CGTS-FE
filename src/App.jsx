import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Component/LoginPage/AuthContext.jsx";
import Navbar from "./Component/HomePage/NavBar/NavBar";
import MainLayout from "./Component/MainLayout.jsx";
import HomePage from "./Component/HomePage/HomePage";
import MemPage from "././Component/MemPage/MemPage";
import MembershipPage from "./Component/Membership/MembershipPage/MembershipPage.jsx";
import About from "./Component/Features/About.jsx";
import Profile from "./Component/ProfilePage/Profile.jsx";
import AddChild from "./Component/MemPage/AddChild.jsx";
import BlogGrid from "./Component/Features/Blog/BlogGrid.jsx";
import BlogDetail from "./Component/Features/Blog/BlogDetail.jsx";
import BlogPage from "./Component/Features/Blog/BlogPage.jsx";
import UpdateGrowthMetrics from "./Component/MemPage/UpdateGrowthMetrics.jsx";
import LoginPage from "./Component/LoginPage/Login.jsx";
import SignupPage from "./Component/SignUp/Signup";
import PaymentSuccess from "./Component/Membership/PaymentSuccess/PaymentResultPage.jsx";
import ConsultationResponse from './Component/MemPage/ConsultationResponse.jsx';
import DoctorMem from './Component/MemPage/DoctorMem.jsx';
import DoctorProfile from './Component/Doctor/DoctorProfile.jsx';
import ConsultationRequest from './Component/MemPage/ConsultationRequest.jsx';

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
          <Route path="/update-growth-metrics/:childId" element={<UpdateGrowthMetrics />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} /> 
          <Route path="/ConsultationResponse" element={<ConsultationResponse />} />
          <Route path="/doctors-list" element={<DoctorMem />} />
          <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
          <Route path="/ConsultationRequest" element={<ConsultationRequest />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
