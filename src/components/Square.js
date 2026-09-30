import React from "react";
import { X, Circle } from "lucide-react";

const Square = ({ index, cell, handleMove, highlight, moveAge, hintMode = false, disabled = false }) => {
  const handleClick = () => {
    handleMove(index);
  };

  const renderContent = () => {
    if (!cell) return null;
    if (cell.player === "X") {
      return <X className="text-blue-500 transition-transform transform hover:scale-125" size={32} />;
    }
    if (cell.player === "O") {
      return <Circle className="text-red-500 transition-transform transform hover:scale-125" size={32} />;
    }
    return null;
  };

  return (
    <button
      onClick={handleClick}
      className={`game-square aspect-square bg-white rounded-lg shadow-md flex items-center justify-center transition
        ${!hintMode && highlight ? "border-4 border-yellow-500" : "border-2 border-gray-300"}
        ${hintMode && moveAge ? `hint-age-${moveAge}` : ""}
        ${cell ? "hover:scale-105" : "hover:bg-gray-100"}
      `}
      disabled={disabled || cell !== null}
      aria-label={cell ? `Cell ${index + 1}: ${cell.player}${hintMode && moveAge ? `, ${["last", "second last", "third last"][moveAge - 1]} move` : ""}` : `Cell ${index + 1}: empty`}
    >
      {renderContent()}
      {hintMode && moveAge && <span className="move-age-badge" aria-hidden="true">{moveAge}</span>}
    </button>
  );
};

export default Square;
