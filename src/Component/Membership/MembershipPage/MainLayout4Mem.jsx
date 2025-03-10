import React from 'react';
import Header from '../../HomePage/NavBar/NavBar';
import Footer from '../../HomePage/Footer/Footer';
import Body from '../../HomePage/Body/Body';

const MainLayout4Mem = ({ hideBody = false, children ,isLoggedIn}) => {
  return (
    <div className="main-layout">
      <Header isLoggedIn={isLoggedIn} />
      {!hideBody && <Body />}
      <div className="main-content">{children}</div> {/* Added this to render MembershipPage content */}
      <Footer />
    </div>
  );
};

export default MainLayout4Mem;
