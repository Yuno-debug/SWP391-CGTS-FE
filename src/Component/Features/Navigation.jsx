import React from 'react';
import './Navigation.css';

function Navigation() {
  const navItems = [
    { id: 1, name: "Home", active: true },
    { id: 2, name: "Categories", active: false },
    { id: 3, name: "About", active: false },
    { id: 4, name: "Contact", active: false }
  ];

  return (
    <nav>
      <ul>
        {navItems.map(item => (
          <li key={item.id}>
            <a href="Blog" className={item.active ? "active" : ""}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;