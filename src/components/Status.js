// src/components/Status.js
import React from "react";
import { Copy } from "lucide-react";

const Status = ({ roomId, gameData, player, username, addToast }) => {
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

  const copyRoomId = async () => {
    if (!navigator.clipboard) {
      addToast("Clipboard API not available.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(roomId);
      addToast("Room ID copied to clipboard!", "success");
    } catch (err) {
      addToast("Failed to copy Room ID.", "error");
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="text-center mb-6 px-4">
      <div className="flex items-center justify-center mb-3"> {/* Increased mb-2 to mb-3 */}
        <p className="text-lg text-white mr-2">
          Room ID: <span className="font-mono font-semibold">{roomId}</span> {/* Added font-semibold to roomId itself for better visibility */}
        </p>
        <button onClick={copyRoomId} className="text-white hover:text-gray-300">
          <Copy size={20} />
        </button>
      </div>
      <p className="text-3xl font-bold text-white mt-2 mb-2">{getStatusMessage()}</p> {/* Changed to text-3xl, font-bold, added mb-2 */}
      <p className="text-lg text-white mt-1"> {/* Changed text-md to text-lg for "You are" line */}
        You are:{" "}
        <span className="font-bold text-yellow-300">{username}</span>
        <span className="font-semibold text-gray-200 ml-1">({player})</span> {/* Added ml-1 for slight separation */}
      </p>
    </div>
  );
};

export default Status;
