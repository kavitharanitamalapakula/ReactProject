import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import '../../Styles/dashboard.css';
import ProfileCard from './Profile';
import MeetingShedule from './MeetingShedule';
import Header from './Header';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('home');
  const [meetings, setMeetings] = useState([]);
 
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  const handleMeetingAdd = (meeting) => {
    setMeetings(prevMeetings => [...prevMeetings, meeting]);
  };
  const now = new Date();
  const ongoingMeetings = meetings.filter(meeting => new Date(meeting.datetime) > now);

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onMenuSelect={handleMenuSelect} ongoingMeetings={ongoingMeetings} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {selectedMenu === 'home' && <Home onMeetingAdd={handleMeetingAdd} />}
        {selectedMenu === 'meeting' && <MeetingShedule meetings={meetings} />}
        {selectedMenu === 'profile' && <ProfileCard />}
      </main>
    </div>
  );
};

export default Dashboard;
