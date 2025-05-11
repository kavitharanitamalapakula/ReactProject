import React, { useState } from "react";
import { MeetingProvider, MeetingConsumer, useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { createMeeting } from "@videosdk.live/js-sdk";

const API_KEY = "e704681c-684a-4c14-a7c7-f1de246ba255";  

// Helper to create meeting ID
const getMeetingId = async () => {
  const res = await createMeeting({ token: API_KEY });
  return res.meetingId;
};

const ParticipantView = ({ participantId }) => {
  const { webcamStream, micStream, isLocal, displayName } = useParticipant(participantId);

  return (
    <div className="border p-2 m-1 w-64 h-48">
      <p className="font-bold text-center">{displayName} {isLocal ? "(You)" : ""}</p>
      {webcamStream && (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={(videoEl) => {
            if (videoEl) {
              videoEl.srcObject = new MediaStream([webcamStream.track]);
            }
          }}
          className="w-full h-32"
        />
      )}
    </div>
  );
};

const MeetingView = () => {
  const { join, participants, leave, toggleMic, toggleWebcam, micEnabled, webcamEnabled } = useMeeting();
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    join();
    setJoined(true);
  };

  const handleLeave = () => {
    leave();
    setJoined(false);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        {!joined ? (
          <button onClick={handleJoin} className="bg-green-500 text-white px-4 py-2 rounded">Join</button>
        ) : (
          <>
            <button onClick={handleLeave} className="bg-red-500 text-white px-4 py-2 rounded">Leave</button>
            <button onClick={toggleMic} className={`px-4 py-2 rounded ${micEnabled ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'}`}>
              {micEnabled ? 'Mute Mic' : 'Unmute Mic'}
            </button>
            <button onClick={toggleWebcam} className={`px-4 py-2 rounded ${webcamEnabled ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'}`}>
              {webcamEnabled ? 'Stop Video' : 'Start Video'}
            </button>
          </>
        )}
      </div>
      <p className="mb-2 font-semibold">Participants: {participants.size}</p>
      <div className="flex flex-wrap">
        {[...participants.keys()].map((id) => (
          <ParticipantView key={id} participantId={id} />
        ))}
      </div>
    </div>
  );
};

const VideoConference = () => {
  const [meetingId, setMeetingId] = React.useState("");

  const handleCreateMeeting = async () => {
    const id = await getMeetingId();
    setMeetingId(id);
  };

  return (
    <div className="p-4">
      {!meetingId ? (
        <button onClick={handleCreateMeeting} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Meeting
        </button>
      ) : (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: true,
            webcamEnabled: true,
            name: "John Doe",
          }}
          token={API_KEY}
        >
          <MeetingView />
        </MeetingProvider>
      )}
    </div>
  );
};

export default VideoConference;
