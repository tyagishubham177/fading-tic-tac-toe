import React from "react";
import Square from "./Square";

export const getMoveAges = (board) => {
  const ages = {};

  ["X", "O"].forEach((player) => {
    board
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell?.player === player)
      .sort((a, b) => b.cell.turn - a.cell.turn)
      .slice(0, 3)
      .forEach(({ index }, position) => {
        ages[index] = position + 1;
      });
  });

  return ages;
};

const GameBoard = ({ board, handleMove, highlightCell, disabled = false, hintMode = false }) => {
  const moveAges = hintMode ? getMoveAges(board) : {};

  return (
    <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-sm">
      {board.map((cell, index) => (
        <Square
          key={index}
          index={index}
          cell={cell}
          handleMove={handleMove}
          highlight={index === highlightCell}
          moveAge={moveAges[index]}
          hintMode={hintMode}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default GameBoard;
