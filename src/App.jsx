import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thêm Route, Routes
import Background from './Component/HomePage/Background/Background';
import Navbar from './Component/HomePage/NavBar/NavBar';
import Footer from './Component/HomePage/Footer/Footer';
import Body from './Component/HomePage/Body/Body';
import Membership from './Component/Membership/Membership'; // Import Membership

const App = () => {
  let heroData = [
    { text1: "ads", text2: "qwsd" },
    { text1: "das", text2: "qwe" },
    { text1: "sqwe", text2: "qwe" },
  ];

  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<>
          <Background playStatus={playStatus} heroCount={heroCount} />
          <Body />
        </>} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
