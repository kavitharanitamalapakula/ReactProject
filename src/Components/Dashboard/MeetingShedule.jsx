import React, { useState, useEffect } from 'react';
import { FaPlay, FaCopy, FaEllipsisV, FaTimesCircle } from 'react-icons/fa';
import '../../Styles/MeetingSchedule.css';

const Base_Url = "http://localhost:5000/api/meetings";

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
        const response = await fetch(Base_Url);
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }

        const data = await response.json();
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
              <p className={`status ${getMeetingStatus(meeting.datetime).toLowerCase()}`}>
                {getMeetingStatusIcon(meeting.datetime)} {getMeetingStatus(meeting.datetime)}
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
