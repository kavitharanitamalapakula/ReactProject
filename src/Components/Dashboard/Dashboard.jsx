import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import MeetingShedule from './MeetingShedule';
import '../../Styles/dashboard.css';
import ProfileCard from './Profile';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onMenuSelect={handleMenuSelect} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {selectedMenu === 'home' && <Home />}
        {selectedMenu === 'meeting' && <MeetingShedule />}
        {selectedMenu === 'profile' && <ProfileCard />}
      </main>
    </div>
  );
};

export default Dashboard;
