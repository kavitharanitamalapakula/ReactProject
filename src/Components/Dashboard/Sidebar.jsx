import { FaHome, FaVideo, FaUserCircle } from 'react-icons/fa';
import '../../Styles/sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li>
            <a href="#">
              <FaHome className="icon" />
              <span className="label">Home</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FaVideo className="icon" />
              <span className="label">Meetings</span>
            </a>
          </li>
          <li>
            <a href="#">
              <FaUserCircle className="icon" />
              <span className="label">Profile</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
