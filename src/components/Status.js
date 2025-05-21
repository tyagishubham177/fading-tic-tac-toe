// src/components/Status.js
import React from "react";
import { Copy } from "lucide-react";

const Status = ({ roomId, gameData, player, username, gameOutcomeAnimation }) => {
  const { gameOver, winner, currentPlayer, players } = gameData;

  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        const winnerName = players[winner];
        const isWinnerYou = winner === player;
        let animationClass = "";
        if (gameOutcomeAnimation === "win" && isWinnerYou) {
          animationClass = "animate-win-status";
        } else if (gameOutcomeAnimation === "lose" && !isWinnerYou) {
           // Opponent won, apply win animation to their name
           animationClass = "animate-win-status";
        }
        return (
          <>
            Winner: <span className={animationClass}>{winnerName}</span>
          </>
        );
      }
      // Draw condition
      let drawAnimationClass = "";
      if (gameOutcomeAnimation === "draw") {
        drawAnimationClass = "animate-draw-status";
      }
      return <span className={drawAnimationClass}>It's a Draw!</span>;
    }
    // Active game: Current player highlighting
    const currentPlayerName = players[currentPlayer];
    return (
      <>
        Current Player:{" "}
        <span className="text-yellow-400 font-bold">{currentPlayerName}</span>
      </>
    );
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
