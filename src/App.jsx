import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Component/LoginPage/AuthContext.jsx";
import ProtectedRoute from "./Component/LoginPage/ProtectedRoute.jsx";

import HomePage from "./Component/HomePage/HomePage";
import MemPage from "./Component/MemPage/MemPage";
import MembershipPage from "./Component/Membership/MembershipPage/MembershipPage.jsx";
import About from "./Component/Features/About.jsx";
import Profile from "./Component/ProfilePage/Profile.jsx";
import AddChild from "./Component/MemPage/AddChild.jsx";
import BlogDetail from "./Component/Features/Blog/BlogDetail.jsx";
import BlogPage from "./Component/Features/Blog/BlogPage.jsx";
import UpdateGrowthMetrics from "./Component/MemPage/UpdateGrowthMetrics.jsx";
import LoginPage from "./Component/LoginPage/Login.jsx";
import SignupPage from "./Component/SignUp/Signup";
import PaymentSuccess from "./Component/Membership/PaymentSuccess/PaymentResultPage.jsx";

const App = () => {
  const [prices, setPrices] = useState({
    free: "$0",
    basic: "$9.99 / month",
    premium: "$99.99 / month",
  });

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* Các trang cần bảo vệ */}
          <Route path="/MemPage" element={<ProtectedRoute><MemPage /></ProtectedRoute>} />
          <Route path="/membership" element={<MembershipPage prices={prices} />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/add-child" element={<ProtectedRoute><AddChild /></ProtectedRoute>} />
          <Route path="/update-growth-metrics/:childId" element={<ProtectedRoute><UpdateGrowthMetrics /></ProtectedRoute>} />
          <Route path="/paymentsuccess" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
