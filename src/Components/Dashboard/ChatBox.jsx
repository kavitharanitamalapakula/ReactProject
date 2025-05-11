import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const ChatBox = () => {
  const { chatMessages = [], sendChatMessage } = useMeeting();
  const [input, setInput] = React.useState("");

  // Helper to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border p-2 w-64 flex flex-col">
      <h3 className="font-bold mb-2">Chat</h3>
      <div className="h-40 overflow-y-auto border mb-2 p-1 flex flex-col space-y-1">
        {chatMessages.map((msg, i) => (
          <p key={i} className="text-sm">
            <b>{msg.senderName}:</b> {msg.message}{" "}
            <span className="text-gray-500 text-xs ml-2">{formatTimestamp(msg.timestamp || Date.now())}</span>
          </p>
        ))}
      </div>
      <input
        className="border w-full px-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim() !== "") {
            sendChatMessage(input);
            setInput("");
          }
        }}
        placeholder="Type a message..."
      />
      <button
        onClick={() => {
          if (input.trim() !== "") {
            sendChatMessage(input);
            setInput("");
          }
        }}
        className="bg-blue-500 text-white px-2 mt-1 rounded w-full"
      >
        Send
      </button>
    </div>
  );
};

export default ChatBox;
