// src/components/ScoreBoard.js
import React from "react";
import { Trophy } from "lucide-react";

const ScoreBoard = ({ players, scores, currentPlayer }) => {
  // Prepare and sort player data
  const sortedPlayerEntries = Object.entries(players)
    .map(([mark, name]) => ({
      mark,
      name,
      score: scores[mark] !== undefined ? scores[mark] : 0, // Ensure score is defined
    }))
    .sort((a, b) => {
      if (a.mark === currentPlayer) return -1; // a (current player) comes first
      if (b.mark === currentPlayer) return 1;  // b (current player) comes first
      // Fallback for initial state or if currentPlayer isn't in players (should not happen in normal flow)
      // You could also sort by mark alphabetically as a consistent fallback: return a.mark.localeCompare(b.mark);
      return 0;
    });

  return (
    <div className="w-full max-w-sm mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white text-center">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <Trophy size={24} className="mr-2" />
          Score Board
        </h2>
      </div>
      <div className="flex justify-between p-4 space-x-2">
        {sortedPlayerEntries.map(({ mark, name, score }) => {
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
                {score}
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
