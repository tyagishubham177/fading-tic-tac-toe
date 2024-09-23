// src/components/ResetButton.js
import React from "react";

const ResetButton = ({ resetGame, gameOver }) => {
  return (
    <button
      className={`px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition duration-300
        ${!gameOver ? "hidden" : "block"}
      `}
      onClick={resetGame}
    >
      Reset Game
    </button>
  );
};

export default ResetButton;
