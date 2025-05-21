// src/components/ScoreBoard.js
import React from "react";
import { Trophy } from "lucide-react";

const ScoreBoard = ({ players, scores, currentPlayer }) => {
  return (
    <div className="w-full max-w-sm mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white text-center">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <Trophy size={24} className="mr-2" />
          Score Board
        </h2>
      </div>
      <div className="flex justify-between p-4 space-x-2">
        {Object.entries(players).map(([mark, name]) => {
          const isActivePlayer = mark === currentPlayer;
          return (
            <div
              key={mark}
              className={`text-center flex-1 p-2 rounded-lg transition-all duration-200 ease-in-out ${
                isActivePlayer ? "bg-indigo-100 border-2 border-indigo-400 shadow-lg" : "border border-gray-200"
              }`}
            >
              <p className={`font-semibold ${isActivePlayer ? "text-indigo-700 font-bold" : "text-gray-700"}`}>
                {name}
              </p>
              <p className={`text-3xl ${isActivePlayer ? "text-indigo-700 font-extrabold" : "text-indigo-600 font-bold"}`}>
                {scores[mark]}
              </p>
              <p className={`text-sm ${isActivePlayer ? "text-indigo-500" : "text-gray-500"}`}>
                ({mark})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreBoard;
