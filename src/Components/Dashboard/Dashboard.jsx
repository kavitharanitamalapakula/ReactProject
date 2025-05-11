import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import '../../Styles/dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Home />
      </main>
    </div>
  );
};

export default Dashboard;
