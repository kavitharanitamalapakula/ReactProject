import Carousel from './Carousel';
import "../../Styles/home.css"
import NewMeetingPanel from './NewMeetingPanel';
const Home = ({ onMeetingAdd }) => (
  <main className="content">
    <div className="new-meeting-panel">
      <NewMeetingPanel onMeetingAdd={onMeetingAdd}/>
    </div>
    <div className="carousel">
      <Carousel />
    </div>
  </main>
);

export default Home;
