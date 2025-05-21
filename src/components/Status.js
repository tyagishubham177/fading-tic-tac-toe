// src/components/Status.js
import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";

const Status = ({ roomId, gameData, player, username, gameOutcomeAnimation }) => {
  const { gameOver, winner, currentPlayer, players } = gameData;
  const [showCopySuccessMessage, setShowCopySuccessMessage] = useState(false);

  useEffect(() => {
    if (showCopySuccessMessage) {
      const timer = setTimeout(() => {
        setShowCopySuccessMessage(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer if component unmounts or if message is shown again
    }
  }, [showCopySuccessMessage]);

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
        setShowCopySuccessMessage(true);
      })
      .catch(() => {
        alert("Failed to copy Room ID."); // This alert can remain for failure, as per instructions
      });
  };

  return (
    <div className="text-center mb-6 px-4 relative"> {/* Added relative for absolute positioning of the message */}
      {showCopySuccessMessage && (
        <div className="text-white bg-green-500 px-3 py-1 rounded-md text-sm absolute top-0 right-0 mt-2 mr-2 transition-opacity duration-500 ease-in-out">
          Room ID copied!
        </div>
      )}
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
