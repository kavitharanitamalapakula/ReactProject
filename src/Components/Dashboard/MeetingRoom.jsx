// src/pages/MeetingRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'react-router-dom';
import { FaMicrophone, FaVideo, FaPhoneSlash, FaUser, FaComments } from 'react-icons/fa';
import '../../Styles/MeetingRoom.css';

function MeetingRoom() {
  const { roomId } = useParams();
  const webcamRef = useRef(null);
  const [webcamError, setWebcamError] = useState(null);
  const [hasMediaDevices, setHasMediaDevices] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasMediaDevices(false);
    } else if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        setPermissionGranted(result.state === 'granted' ? true : result.state === 'denied' ? false : null);
        result.onchange = () => {
          setPermissionGranted(result.state === 'granted' ? true : result.state === 'denied' ? false : null);
        };
      }).catch(() => setPermissionGranted(null));
    }
  }, []);

  const handleUserMediaError = (error) => {
    console.error('Webcam error:', error);
    setWebcamError(error.message || 'Error accessing webcam');
  };

  return (
    <div className="meeting-room-container">
      <h2 className="meeting-heading">Meeting Room ID: {roomId}</h2>

      {!hasMediaDevices && <p className="error-message">Browser does not support media devices.</p>}
      {permissionGranted === false && <p className="error-message">Camera access denied. Please allow it.</p>}
      {webcamError && <p className="error-message">Webcam error: {webcamError}</p>}

      {!webcamError && hasMediaDevices && (
        <Webcam
          audio={true}
          mirrored={true}
          videoConstraints={{ facingMode: "user" }}
          className="webcam-box"
          ref={webcamRef}
          onUserMediaError={handleUserMediaError}
        />
      )}

      <div className="control-bar">
        <FaMicrophone size={24} />
        <FaVideo size={24} />
        <FaPhoneSlash size={24} color="red" />
        <FaUser size={24} />
        <FaComments size={24} />
      </div>
    </div>
  );
}

export default MeetingRoom;
