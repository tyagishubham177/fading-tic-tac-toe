// src/components/Square.js
import React from "react";
import { X, Circle } from "lucide-react";

const Square = ({ index, cell, handleMove }) => {
  const handleClick = () => {
    handleMove(index);
  };

  const renderContent = () => {
    if (!cell) return null;
    if (cell.player === "X") {
      return <X className="text-blue-500 transition-transform transform hover:scale-125" size={36} />;
    }
    if (cell.player === "O") {
      return <Circle className="text-red-500 transition-transform transform hover:scale-125" size={36} />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg shadow-md flex items-center justify-center transition 
        ${cell?.fading ? "bg-yellow-200 animate-pulse" : "hover:scale-105"}
      `}
    >
      {renderContent()}
    </button>
  );
};

export default Square;
