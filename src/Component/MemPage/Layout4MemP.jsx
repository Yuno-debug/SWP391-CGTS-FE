import React from 'react';
import NavBar from '../HomePage/NavBar/NavBar';
import Footer from '../HomePage/Footer/Footer';
import './Layout4MemP.css';
import Background from '../MemPage/Background4Mem';

const LayoutForAb = ({ children }) => {
  return (
    <div className="layout-for-ab">
      <NavBar isLoggedIn={true} />
      <Background/>
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutForAb;