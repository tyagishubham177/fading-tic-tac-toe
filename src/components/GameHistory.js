// src/components/GameHistory.js
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const GameHistory = ({ gameHistory }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="mt-6 w-full max-w-sm bg-white rounded-lg shadow-md p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-xl font-bold">Game History</h2>
        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>
      {!isCollapsed && (
        <div className="mt-2">
          {gameHistory.length === 0 ? (
            <p>No games played yet.</p>
          ) : (
            <ul>
              {gameHistory.map((game, index) => (
                <li key={index} className="mb-2">
                  Game {index + 1}: {game.winner ? `${game.winnerName} won` : "Draw"} in {game.moves} moves
                  <br />
                  <small>{new Date(game.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;
