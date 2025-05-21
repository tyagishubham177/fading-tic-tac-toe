// src/components/Lobby.js
import React, { useState } from "react";

const Lobby = ({
  createRoom,
  joinRoom,
  initialUsername = "",
  initialRoomId = "",
  isCreatingRoom,
  isJoiningRoom,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [localRoomId, setLocalRoomId] = useState(initialRoomId);

  const handleCreateRoom = () => {
    if (isCreatingRoom || isJoiningRoom) return;
    createRoom(username);
  };

  const handleJoinRoom = () => {
    if (isCreatingRoom || isJoiningRoom) return;
    joinRoom(localRoomId, username);
  };

  const isLoading = isCreatingRoom || isJoiningRoom;

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={`w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
      />
      <button
        className={`w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 mb-4 text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleCreateRoom}
        disabled={isLoading}
      >
        {isCreatingRoom ? "Starting..." : "Start Game"}
      </button>
      <div className="flex w-full">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={localRoomId}
          onChange={(e) => setLocalRoomId(e.target.value)}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        />
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-r-lg shadow-lg hover:bg-blue-600 transition duration-300 text-base sm:text-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleJoinRoom}
          disabled={isLoading}
        >
          {isJoiningRoom ? "Joining..." : "Join Game"}
        </button>
      </div>
    </div>
  );
};

export default Lobby;
