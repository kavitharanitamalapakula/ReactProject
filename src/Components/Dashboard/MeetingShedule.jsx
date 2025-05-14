import { FaPlay, FaCopy, FaEllipsisV, FaTimesCircle } from 'react-icons/fa';
import '../../Styles/MeetingSchedule.css';

const MeetingSchedule = ({ meetings }) => {
  return (
    <div className="meeting-schedule">
      <h2>Meetings</h2>
      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <div className="meeting-list">
          {meetings.map((meeting, index) => (
            <div key={index} className="meeting-card">
              <div className="card-header">
                <h3>{meeting.title}</h3>
                <button className="menu-btn">
                  <FaEllipsisV />
                </button>
              </div>
              <p className="datetime">
                {new Date(meeting.datetime).toLocaleString()}
              </p>
              <p className="status not-active">
                <FaTimesCircle /> Not Active
              </p>
              <p className="description">{meeting.description}</p>
              <div className="card-actions">
                <button className="start-btn">
                  <FaPlay /> Start
                </button>
                <button className="copy-btn">
                  <FaCopy /> Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingSchedule;
