// src/components/Lobby.js
import React, { useEffect } from "react";

const Lobby = ({ createRoom, joinRoom, roomId, setRoomId, username, setUsername }) => {
  // Load username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }
  }, [username]);

  const handleAction = () => {
    if (roomId) {
      joinRoom();
    } else {
      createRoom();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
      />
      <input
        type="text"
        placeholder="Enter Room ID (optional)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
      />
      <button
        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-base sm:text-lg"
        onClick={handleAction}
      >
        {roomId ? "Join Game" : "Start New Game"}
      </button>
    </div>
  );
};

export default Lobby;
