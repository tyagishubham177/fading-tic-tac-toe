// src/components/Status.js
import React from "react";
import { Copy } from "lucide-react";

const Status = ({ roomId, gameData, player, username }) => {
  const { gameOver, winner, currentPlayer, players } = gameData;

  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        const winnerName = players[winner];
        return `Winner: ${winnerName}`;
      }
      return "It's a Draw!";
    }
    const currentPlayerName = players[currentPlayer];
    return `Current Player: ${currentPlayerName}`;
  };

  const copyRoomId = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        alert("Room ID copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy Room ID.");
      });
  };

  return (
    <div className="text-center mb-6 px-4">
      <div className="flex items-center justify-center mb-2">
        <p className="text-lg text-white mr-2">
          Room ID: <span className="font-mono">{roomId}</span>
        </p>
        <button onClick={copyRoomId} className="text-white hover:text-gray-300">
          <Copy size={20} />
        </button>
      </div>
      <p className="text-2xl font-semibold text-white mt-2">{getStatusMessage()}</p>
      <p className="text-md text-white mt-1">
        You are:{" "}
        <span className="font-bold">
          {username} ({player})
        </span>
      </p>
    </div>
  );
};

export default Status;
