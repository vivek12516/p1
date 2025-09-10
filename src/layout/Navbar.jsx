import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>App</h2>
        </div>
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="/courses" className="nav-link">Courses</a>
            </li>
            <li className="nav-item">
              <a href="/profile" className="nav-link">Profile</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;