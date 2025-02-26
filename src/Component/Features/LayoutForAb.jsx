import React from 'react';
import NavBar from '../HomePage/NavBar/NavBar';
import Footer from '../HomePage/Footer/Footer';
import './LayoutForAb.css';

const LayoutForAb = ({ children }) => {
  return (
    <div className="layout-for-ab">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutForAb;