// src/components/ScoreBoard.js
import React from "react";
import { Trophy } from "lucide-react";

const ScoreBoard = ({ players, scores }) => {
  return (
    <div className="w-full max-w-sm mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white text-center">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <Trophy size={24} className="mr-2" />
          Score Board
        </h2>
      </div>
      <div className="flex justify-between p-4">
        {Object.entries(players).map(([mark, name]) => (
          <div key={mark} className="text-center flex-1">
            <p className="font-semibold text-gray-700">{name}</p>
            <p className="text-3xl font-bold text-indigo-600">{scores[mark]}</p>
            <p className="text-sm text-gray-500">({mark})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
