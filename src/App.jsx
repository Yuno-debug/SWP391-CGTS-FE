import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Component/MainLayout.jsx";
import HomePage from "./Component/HomePage/HomePage";
import Membership from "./Component/Membership/Membership";
import MemPage from "././Component/MemPage/MemPage";
// import Search from "././Component/Search/Search";
import LoginPage from "././Component/LoginPage/Login.jsx";
import SignUp from "././Component/SignUp/Signup.jsx";
import React from 'react';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        <Route path="/MemPage" element={<MemPage />} /> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/membership" element={<Membership />} /> 
      </Routes>
    </Router>
  );
};

export default App;
