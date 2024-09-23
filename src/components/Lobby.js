// src/components/Lobby.js
import React from "react";

const Lobby = ({ createRoom, joinRoom, roomId, setRoomId }) => {
  return (
    <div className="flex flex-col items-center">
      <button
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 mb-4"
        onClick={createRoom}
      >
        Start Game
      </button>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={joinRoom}
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
