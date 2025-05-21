import React from "react";
import GameBoard from "./GameBoard";
import Status from "./Status";
import ResetButton from "./ResetButton";
import GameHistory from "./GameHistory";
import ScoreBoard from "./ScoreBoard";
import useGame from "../hooks/useGame"; // Import the entire useGame hook

const Game = ({ roomId, gameData, player, username }) => {
  const { handleMove, resetGame } = useGame(roomId, player); // Destructure the needed functions

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto px-4 md:gap-8">
      {/* First Column */}
      <div className="flex flex-col w-full md:w-1/3 space-y-4 md:space-y-6 py-4">
        <ScoreBoard players={gameData.players} scores={gameData.scores} />
        <GameHistory gameHistory={gameData.gameHistory} />
      </div>

      {/* Second Column */}
      <div className="flex flex-col w-full md:w-2/3 items-center space-y-4 md:space-y-6 py-4">
        <Status roomId={roomId} gameData={gameData} player={player} username={username} />
        <GameBoard
          board={gameData.board}
          handleMove={(index) => handleMove(index)}
          highlightCell={gameData.highlightCell}
        />
        <ResetButton resetGame={() => resetGame()} gameOver={gameData.gameOver} />
      </div>
    </div>
  );
};

export default Game;
