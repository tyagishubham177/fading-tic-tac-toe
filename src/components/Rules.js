import React from "react";
import { X } from "lucide-react";

const Rules = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Game Rules</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          <li>Players take turns placing their symbol (X or O) on an empty cell.</li>
          <li>The game starts with player X.</li>
          <li>After 6 turns, the oldest mark of the current player will start fading.</li>
          <li>The fading mark is highlighted in yellow for both players to see.</li>
          <li>On the 7th turn and onwards, the oldest mark disappears when a new one is placed.</li>
          <li>
            The first player to get three of their symbols in a row (horizontally, vertically, or diagonally)
            wins.
          </li>
          <li>If the board is full and no player has won, the game is a draw.</li>
        </ul>
      </div>
    </div>
  );
};

export default Rules;
