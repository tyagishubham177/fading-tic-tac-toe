// src/components/Status.js
import React from "react";

const Status = ({ roomId, gameData, player }) => {
  const { gameOver, winner, currentPlayer } = gameData;

  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        return `Winner: Player ${winner}`;
      }
      return "It's a Draw!";
    }
    return `Current Player: ${currentPlayer}`;
  };

  return (
    <div className="text-center mb-6">
      <p className="text-lg text-white">
        Room ID: <span className="font-mono">{roomId}</span>
      </p>
      <p className="text-2xl font-semibold text-white mt-2">{getStatusMessage()}</p>
      <p className="text-md text-white mt-1">
        You are: <span className="font-bold">{player}</span>
      </p>
    </div>
  );
};

export default Status;
