import React from 'react';
import Carousel from './Carousel';
import NewMeetingPanel from './NewMeetingPanel';
import "../../Styles/home.css"
const Home = () => (
  <main className="content">
    <div className="new-meeting-panel">
      <NewMeetingPanel />
    </div>
    <div className="carousel">
      <Carousel />
    </div>
  </main>
);

export default Home;
