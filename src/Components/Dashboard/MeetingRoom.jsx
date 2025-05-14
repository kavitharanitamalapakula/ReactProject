import React from 'react';
import { useParams } from 'react-router-dom';
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { getToken } from "./getToken"; // function to securely fetch token

function MeetingRoom() {
  const { roomId } = useParams();

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Guest",
      }}
      token={VIDEO_SDK_TOKEN}
    >
      <MeetingConsumer>
        {() => (
          // Your custom UI or use VideoSDK's default MeetingView
          <h2>Meeting Room: {roomId}</h2>
        )}
      </MeetingConsumer>
    </MeetingProvider>
  );
}
