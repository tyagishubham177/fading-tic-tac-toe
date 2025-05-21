import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import Rules from "./Rules";
import { createGameRoom, joinGameRoom } from "../utils/firebaseUtils";
import useGame from "../hooks/useGame";
import { Info } from "lucide-react";

const MultiplayerTicTacToe = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState("");
  const [showRules, setShowRules] = useState(false);

  const { gameData, handleMove, resetGame } = useGame(roomId, player);

  const createRoom = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    const newRoomId = Math.random().toString(36).substr(2, 9).toUpperCase();
    try {
      await createGameRoom(newRoomId, username);
      setRoomId(newRoomId);
      setPlayer("X");
      setJoined(true);
    } catch (error) {
      console.error("Error in createRoom:", error);
      alert("Error creating room. Please try again.");
    }
  };

  const joinRoom = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    try {
      const joinedSuccess = await joinGameRoom(roomId, username);
      if (joinedSuccess) {
        setPlayer("O");
        setJoined(true);
      } else {
        alert("Room is full or does not exist!");
      }
    } catch (error) {
      console.error("Error in joinRoom:", error);
      alert("Error joining room. Please check the Room ID and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 px-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Fading Tic-Tac-Toe</h1>
      {!joined ? (
        <>
          <Lobby
            createRoom={createRoom}
            joinRoom={joinRoom}
            roomId={roomId}
            setRoomId={setRoomId}
            username={username}
            setUsername={setUsername}
          />
          <button
            onClick={() => setShowRules(true)}
            className="mt-4 text-white hover:text-gray-300 flex items-center"
          >
            <Info size={20} className="mr-1" />
            Game Rules
          </button>
        </>
      ) : (
        gameData && (
          <Game
            roomId={roomId}
            gameData={gameData}
            player={player}
            username={username}
            handleMove={handleMove}
            resetGame={resetGame}
          />
        )
      )}
      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default MultiplayerTicTacToe;
