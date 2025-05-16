import React, { useState, useEffect } from 'react';
import { FaPlay, FaCopy, FaEllipsisV, FaTimesCircle } from 'react-icons/fa';
import '../../Styles/MeetingSchedule.css';
import { getMeetings } from '../../api/meetings';
import meetingLogo from "../../assets/meeting.png"
const MeetingSchedule = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMeetingStatus = (datetime) => {
    const now = new Date();
    const start = new Date(datetime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    if (now < start) return "Upcoming";
    else if (now >= start && now <= end) return "Ongoing";
    else return "Completed";
  };

  const getMeetingStatusIcon = (datetime) => {
    const status = getMeetingStatus(datetime);
    if (status === "Upcoming") return <FaPlay />;
    if (status === "Ongoing") return <FaPlay />;
    return <FaTimesCircle />;
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error(err.message);
        setError('Unable to load meetings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) return <p>Loading meetings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="meeting-schedule">
      {meetings.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column",alignItems:"center" }}>
          <img src={meetingLogo} alt="MeetingLogo" width={"80%"} height={"20%"} />
          <h4 >No meetings scheduled.</h4>
        </div>
      ) : (
        <div className="meeting-list">
          <h2>Meeting Scheduled</h2>
          {meetings.map((meeting) => (
            <div key={meeting.id || meeting._id} className="meeting-card">
              <div className="card-header">
                <h3>{meeting.title}</h3>
                <button className="menu-btn" disabled>
                  <FaEllipsisV />
                </button>
              </div>
              <p className="datetime">
                {new Date(meeting.datetime).toLocaleString()}
              </p>
              <p className={`status ${getMeetingStatus(meeting.datetime).toLowerCase()}`}>
                {getMeetingStatusIcon(meeting.datetime)} {getMeetingStatus(meeting.datetime)}
              </p>
              <p className="description">{meeting.description}</p>
              <div className="card-actions">
                <button className="start-btn" disabled>
                  <FaPlay /> Start
                </button>
                <button className="copy-btn" disabled>
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
