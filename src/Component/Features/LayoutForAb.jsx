import React from 'react';
import NavBar from '../HomePage/NavBar/NavBar';
import Footer from '../HomePage/Footer/Footer';
import './LayoutForAb.css';

const LayoutForAb = ({ children, isLoggedIn }) => {
  return (
    <div className="layout-for-ab">
      <NavBar isLoggedIn={true} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutForAb;