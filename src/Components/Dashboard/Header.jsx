import Logo from '../../assets/Logo.png';
import '../../Styles/header.css';
const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="left-section">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          &#9776;
        </button>
        <img src={Logo} alt="Logo" className="logo" />
        <h1>MeetUpNow</h1>
      </div>
      <button className="logout-btn" aria-label="Logout">
        Logout
      </button>
    </header>
  );
};

export default Header;
