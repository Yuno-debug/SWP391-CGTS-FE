import React from 'react';
import NavBarLogin from '../MemPage/NavBarLogin';
import Footer from '../HomePage/Footer/Footer';
import './Layout4MemP.css';

const LayoutForAb = ({ children }) => {
  return (
    <div className="layout-for-ab">
      <NavBarLogin />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutForAb;