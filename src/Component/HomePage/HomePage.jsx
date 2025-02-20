import React from "react";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Body from "./Body/Body";
import Background from "./Background/Background";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Background />
      <Body />
      <Footer />
    </div>
  );
};

export default HomePage;
