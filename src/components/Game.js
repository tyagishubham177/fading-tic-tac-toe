import React from "react";
import GameBoard from "./GameBoard";
import Status from "./Status";
import ResetButton from "./ResetButton";
import GameHistory from "./GameHistory";
import ScoreBoard from "./ScoreBoard";
// useGame hook is already used in MultiplayerTicTacToe and its functions (handleMove, resetGame) are passed down.
// No need to call useGame here again.

const Game = ({ roomId, gameData, player, username, handleMove, resetGame, addToast }) => {
  // handleMove and resetGame are now passed as props from MultiplayerTicTacToe

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <ScoreBoard players={gameData.players} scores={gameData.scores} />
      <Status roomId={roomId} gameData={gameData} player={player} username={username} addToast={addToast} />
      <GameBoard
        board={gameData.board}
        handleMove={handleMove} // Directly use the passed prop
        highlightCell={gameData.highlightCell}
      />
      <ResetButton resetGame={resetGame} gameOver={gameData.gameOver} /> {/* Directly use the passed prop */}
      <GameHistory gameHistory={gameData.gameHistory} />
    </div>
  );
};

export default Game;
