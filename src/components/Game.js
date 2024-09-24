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
    <div className="flex flex-col items-center w-full max-w-sm">
      <ScoreBoard players={gameData.players} scores={gameData.scores} />
      <Status roomId={roomId} gameData={gameData} player={player} username={username} />
      <GameBoard
        board={gameData.board}
        handleMove={(index) => handleMove(index)}
        highlightCell={gameData.highlightCell}
      />
      <ResetButton resetGame={() => resetGame()} gameOver={gameData.gameOver} />
      <GameHistory gameHistory={gameData.gameHistory} />
    </div>
  );
};

export default Game;
