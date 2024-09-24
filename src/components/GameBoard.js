// src/components/GameBoard.js
import React from "react";
import Square from "./Square";

const GameBoard = ({ board, handleMove }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {board.map((cell, index) => (
        <button
          key={index}
          className={`cell ${cell?.highlight ? "highlighted" : ""}`}
          onClick={() => handleMove(index)}
          disabled={!!cell}
        >
          {cell?.player || ""}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
