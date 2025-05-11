import React, { useState, useRef, useEffect } from 'react';
import { Link, Plus, Calendar } from 'lucide-react';
import '../../Styles/newmeetingpanel.css'; // Import the CSS file
import { FaVideo } from 'react-icons/fa';

function NewMeetingPanel() {
  const [showOptions, setShowOptions] = useState(false);
  const panelRef = useRef(null);

  const toggleOptions = () => setShowOptions(!showOptions);

  // Close popup if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  return (
    <div className="new-meeting-panel">
      <h3 className="title">Video Calls and meetings for everyone</h3>
      <p className="description">
        Connect, collaborate and celebrate from anywhere with MeepUpNow
      </p>

      <button onClick={toggleOptions} className="new-meeting-button">
        <FaVideo className="icon me-3" />
        <span>New Meeting</span>
      </button>

      {showOptions && (
        <div ref={panelRef} className="popup-panel">
          <button className="popup-option">
            <Link size={18} className="icon" />
            Create a meeting for later
          </button>
          <button className="popup-option">
            <Plus size={18} className="icon" />
            Start an instant meeting
          </button>
          <button className="popup-option">
            <Calendar size={18} className="icon" />
            Schedule in Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}

export default NewMeetingPanel;
