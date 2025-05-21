import React from "react";
import Square from "./Square";

const GameBoard = ({ board, handleMove, highlightCell }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-sm">
      {board.map((cell, index) => (
        <Square
          key={index}
          index={index}
          cell={cell}
          handleMove={handleMove}
          highlight={index === highlightCell}
        />
      ))}
    </div>
  );
};

export default GameBoard;
