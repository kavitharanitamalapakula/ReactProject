import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaUser,
  FaComments,
  FaDesktop
} from 'react-icons/fa';
import '../../Styles/MeetingRoom.css';

const SIGNALING_SERVER_URL = 'ws://localhost:5000'; 
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

function MeetingRoom() {
  const { roomId } = useParams();
  const webcamRef = useRef(null);
  const [webcamError, setWebcamError] = useState(null);
  const [hasMediaDevices, setHasMediaDevices] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenTrackRef = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const peerConnections = useRef({});
  const ws = useRef(null);
  // const toggleScreenSharing = async () => {
  //   if (!localStream) return;

  //   if (!isScreenSharing) {
  //     try {
  //       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  //       const screenTrack = screenStream.getVideoTracks()[0];
  //       screenTrackRef.current = screenTrack;
  //       Object.values(peerConnections.current).forEach((pc) => {
  //         const sender = pc.getSenders().find(s => s.track.kind === 'video');
  //         if (sender) {
  //           sender.replaceTrack(screenTrack);
  //         }
  //       });
  //       const newStream = new MediaStream([screenTrack, ...localStream.getAudioTracks()]);
  //       if (webcamRef.current) {
  //         webcamRef.current.srcObject = newStream;
  //       }

  //       screenTrack.onended = () => {
  //         stopScreenSharing();
  //       };

  //       setIsScreenSharing(true);
  //     } catch (err) {
  //       console.error("Error starting screen sharing:", err);
  //     }
  //   } else {
  //     stopScreenSharing();
  //   }
  // };

  const stopScreenSharing = () => {
    if (!screenTrackRef.current) return;

    screenTrackRef.current.stop();
    const videoTrack = localStream.getVideoTracks()[0];
    Object.values(peerConnections.current).forEach((pc) => {
      const sender = pc.getSenders().find(s => s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });
    if (webcamRef.current) {
      webcamRef.current.srcObject = localStream;
    }

    setIsScreenSharing(false);
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasMediaDevices(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        // connectWebSocket();
      })
      .catch((error) => {
        setWebcamError(error.message || 'Error accessing webcam');
      });

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        setPermissionGranted(result.state === 'granted' ? true : result.state === 'denied' ? false : null);
        result.onchange = () => {
          setPermissionGranted(result.state === 'granted' ? true : result.state === 'denied' ? false : null);
        };
      }).catch(() => setPermissionGranted(null));
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
      setRemoteStreams([]);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // const connectWebSocket = () => {
  //   ws.current = new WebSocket(SIGNALING_SERVER_URL);

  //   ws.current.onopen = () => {
  //     console.log('Connected to signaling server');
  //     ws.current.send(JSON.stringify({ type: 'join', roomId }));
  //   };

  //   ws.current.onmessage = async (message) => {
  //     const data = JSON.parse(message.data);
  //     const { from, type, payload } = data;

  //     if (from === ws.current.id) return; 

  //     switch (type) {
  //       case 'offer':
  //         await handleOffer(from, payload);
  //         break;
  //       case 'answer':
  //         await handleAnswer(from, payload);
  //         break;
  //       case 'ice-candidate':
  //         await handleIceCandidate(from, payload);
  //         break;
  //       case 'id':
  //         ws.current.id = payload;
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  //   ws.current.onclose = () => {
  //     console.log('Disconnected from signaling server');
  //   };

  //   ws.current.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };
  // };

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(JSON.stringify({
          type: 'ice-candidate',
          to: peerId,
          from: ws.current.id,
          payload: event.candidate,
        }));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prevStreams) => {
        const streamExists = prevStreams.some(s => s.id === event.streams[0].id);
        if (!streamExists) {
          return [...prevStreams, event.streams[0]];
        }
        return prevStreams;
      });
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const handleOffer = async (peerId, offer) => {
    const pc = createPeerConnection(peerId);
    peerConnections.current[peerId] = pc;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    ws.current.send(JSON.stringify({
      type: 'answer',
      to: peerId,
      from: ws.current.id,
      payload: answer,
    }));
  };

  const handleAnswer = async (peerId, answer) => {
    const pc = peerConnections.current[peerId];
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = async (peerId, candidate) => {
    const pc = peerConnections.current[peerId];
    if (!pc) return;
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  };

  const callPeer = async (peerId) => {
    const pc = createPeerConnection(peerId);
    peerConnections.current[peerId] = pc;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.current.send(JSON.stringify({
      type: 'offer',
      to: peerId,
      from: ws.current.id,
      payload: offer,
    }));
  };

  const handleNewPeer = (peerId) => {
    callPeer(peerId);
  };

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      const { type, from, payload, peers } = data;

      if (type === 'id') {
        ws.current.id = payload;
      } else if (type === 'new-peer') {
        if (ws.current.id !== payload) {
          handleNewPeer(payload);
        }
      } else if (type === 'offer') {
        await handleOffer(from, payload);
      } else if (type === 'answer') {
        await handleAnswer(from, payload);
      } else if (type === 'ice-candidate') {
        await handleIceCandidate(from, payload);
      } else if (type === 'peers') {
        peers.forEach(peerId => {
          if (peerId !== ws.current.id) {
            handleNewPeer(peerId);
          }
        });
      }
    };
  }, [localStream]);

  const toggleMicrophone = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMicOn((prev) => !prev);
  };

  const toggleVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOn((prev) => !prev);
  };

  const handleShowRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert(`Room ID copied: ${roomId}`);
  };

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div className="meeting-room-container">
      <h2 className="meeting-heading">Meeting Room ID: {roomId}</h2>

      {!hasMediaDevices && <p className="error-message">Browser does not support media devices.</p>}
      {permissionGranted === false && <p className="error-message">Camera access denied. Please allow it.</p>}
      {webcamError && <p className="error-message">Webcam error: {webcamError}</p>}

      <div className="video-container">
        <video
          ref={webcamRef}
          autoPlay
          muted
          playsInline
          className="webcam-box"
        />
        {remoteStreams.map((stream) => (
          <video
            key={stream.id}
            autoPlay
            playsInline
            className="webcam-box"
            ref={(video) => {
              if (video) {
                video.srcObject = stream;
              }
            }}
          />
        ))}
      </div>

      <div className="control-bar">
        <button onClick={toggleMicrophone} className="control-button">
          {isMicOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
        </button>
        <button onClick={toggleVideo} className="control-button">
          {isVideoOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </button>
        {/* <button onClick={toggleScreenSharing} className="control-button">
          {isScreenSharing ? <FaPhoneSlash size={24} /> : <FaDesktop size={24} />}
        </button>
        <button onClick={handleShowRoomId} className="control-button">
          <FaUser size={24} />
        </button>
        <button onClick={toggleChat} className="control-button">
          <FaComments size={24} />
        </button> */}
      </div>
      {showChat && (
        <div className="chat-panel">
          <p><strong>Chat:</strong> (Feature under development)</p>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
