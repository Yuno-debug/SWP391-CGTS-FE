import React from 'react';
import NavBarLogin from '../MemPage/NavBarLogin';
import Footer from '../HomePage/Footer/Footer';
import './Layout4MemP.css';
import Background from '../MemPage/Background4Mem';

const LayoutForAb = ({ children }) => {
  return (
    <div className="layout-for-ab">
      <NavBarLogin />
      <Background/>
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutForAb;