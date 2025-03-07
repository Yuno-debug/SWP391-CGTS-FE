import React from "react";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Body from "./Body/Body";
import Background from "./Background/Background";
const HomePage = (isLoggedIn) => {
  return (
    <div>
      <Navbar isLoggedIn={false} />
      <Background />
      <Body />
      <Footer />
    </div>
  );
};

export default HomePage;