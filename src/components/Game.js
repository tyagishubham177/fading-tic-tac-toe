import React, { useState, useEffect } from "react";
import GameBoard from "./GameBoard";
import Status from "./Status";
import ResetButton from "./ResetButton";
import GameHistory from "./GameHistory";
import ScoreBoard from "./ScoreBoard";
import useGame from "../hooks/useGame"; // Import the entire useGame hook

const Game = ({ roomId, gameData, player, username }) => {
  const { handleMove, resetGame } = useGame(roomId, player); // Destructure the needed functions
  const [gameOutcomeAnimation, setGameOutcomeAnimation] = useState(null);

  useEffect(() => {
    if (gameData.gameOver) {
      if (gameData.winner) {
        if (gameData.winner === player) {
          setGameOutcomeAnimation("win");
        } else {
          setGameOutcomeAnimation("lose");
        }
      } else {
        setGameOutcomeAnimation("draw");
      }
    } else {
      // Reset animation state if the game is not over (e.g., after a reset)
      setGameOutcomeAnimation(null);
    }
  }, [gameData.gameOver, gameData.winner, player]);

  let gameBoardAnimationClass = "";
  if (gameOutcomeAnimation === "win") {
    gameBoardAnimationClass = "animate-win-board";
  } else if (gameOutcomeAnimation === "lose") {
    gameBoardAnimationClass = "animate-lose-board";
  }
  // For draw, board animation is not specified, so it remains empty.

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-4 w-full max-w-5xl mx-auto px-4 md:items-start">
      {/* Mobile Order: ScoreBoard, GameBoard, Status, ResetButton, GameHistory */}

      {/* ScoreBoard */}
      {/* Desktop: Col 1, Row 1 */}
      <div className="md:col-start-1 md:col-span-1 md:row-start-1">
        <ScoreBoard 
          players={gameData.players} 
          scores={gameData.scores} 
          currentPlayer={gameData.currentPlayer} 
          viewingPlayerMark={player} // Pass the viewing player's mark
        />
      </div>

      {/* GameBoard */}
      {/* Desktop: Col 2 (spans 2), Row 1 */}
      <div className={`md:col-start-2 md:col-span-2 md:row-start-1 flex flex-col items-center ${gameBoardAnimationClass}`}>
        <GameBoard
          board={gameData.board}
          handleMove={(index) => handleMove(index)}
          highlightCell={gameData.highlightCell}
        />
      </div>

      {/* Status */}
      {/* Desktop: Col 2 (spans 2), Row 2 */}
      <div className="md:col-start-2 md:col-span-2 md:row-start-2 flex flex-col items-center">
        <Status 
          roomId={roomId} 
          gameData={gameData} 
          player={player} 
          username={username} 
          gameOutcomeAnimation={gameOutcomeAnimation} 
        />
      </div>
      
      {/* ResetButton */}
      {/* Desktop: Col 2 (spans 2), Row 3 */}
      <div className="md:col-start-2 md:col-span-2 md:row-start-3 flex flex-col items-center">
        <ResetButton resetGame={() => resetGame()} gameOver={gameData.gameOver} />
      </div>

      {/* GameHistory */}
      {/* Desktop: Col 1, Row 2 */}
      <div className="md:col-start-1 md:col-span-1 md:row-start-2">
        <GameHistory gameHistory={gameData.gameHistory} />
      </div>
    </div>
  );
};

export default Game;
