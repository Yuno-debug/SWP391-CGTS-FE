import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header>
      <div className="topBar">
        <div className="topBarText">
          <span className="designText">Website was designed by FPT.</span>
          <span className="knowMoreText">Here's how you know</span>
        </div>
      </div>
    </header>
  );
}