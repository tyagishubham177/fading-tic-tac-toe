// src/components/Game.js
import React from "react";
import GameBoard from "./GameBoard";
import Status from "./Status";
import ResetButton from "./ResetButton";
import GameHistory from "./GameHistory";
import ScoreBoard from "./ScoreBoard";
import { handleMove, resetGame, calculateHighlightCell } from "../utils/gameUtils";

const Game = ({ roomId, gameData, player, username }) => {
  const highlightCell = calculateHighlightCell(gameData, player);

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <ScoreBoard players={gameData.players} scores={gameData.scores} />
      <Status roomId={roomId} gameData={gameData} player={player} username={username} />
      <GameBoard
        board={gameData.board}
        handleMove={(index) => handleMove(index, roomId, gameData, player)}
        highlightCell={highlightCell}
      />
      <ResetButton resetGame={() => resetGame(roomId, gameData.players)} gameOver={gameData.gameOver} />
      <GameHistory gameHistory={gameData.gameHistory} />
    </div>
  );
};

export default Game;
