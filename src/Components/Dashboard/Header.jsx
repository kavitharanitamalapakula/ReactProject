import React from 'react';
import Logo from '../../assets/Logo.png';
const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <img src={Logo} alt="Logo" className="logo"/>
        <h1>MeetUpNow</h1>
      </div>
      <button className="logout-btn">
        <span>&#8635;</span> Logout
      </button>
    </header>
  );
};

export default Header;
