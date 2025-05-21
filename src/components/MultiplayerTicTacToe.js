import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import Rules from "./Rules";
import { createGameRoom, joinGameRoom } from "../utils/firebaseUtils";
import useGame from "../hooks/useGame";
import { Info } from "lucide-react";
import useToasts from "../hooks/useToasts";
import ToastContainer from "./ToastContainer";

const MultiplayerTicTacToe = () => {
  const [currentGameRoomId, setCurrentGameRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState("");
  const [showRules, setShowRules] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const { gameData, handleMove, resetGame } = useGame(currentGameRoomId, player);

  const createRoom = async (currentUsername) => {
    if (!currentUsername) {
      addToast("Please enter a username", "error");
      return;
    }
    setIsCreatingRoom(true);
    const newRoomId = Math.random().toString(36).substr(2, 9).toUpperCase();
    try {
      await createGameRoom(newRoomId, currentUsername);
      setCurrentGameRoomId(newRoomId);
      setPlayer("X");
      setJoined(true);
      setUsername(currentUsername);
      addToast(`Room created successfully! Room ID: ${newRoomId}`, "success");
    } catch (error) {
      addToast(`Error creating room: ${error.message}`, "error");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinRoom = async (targetRoomId, currentUsername) => {
    if (!currentUsername) {
      addToast("Please enter a username", "error");
      return;
    }
    if (!targetRoomId) {
      addToast("Please enter a Room ID", "error");
      return;
    }
    setIsJoiningRoom(true);
    try {
      const success = await joinGameRoom(targetRoomId, currentUsername);
      if (success) {
        setCurrentGameRoomId(targetRoomId);
        setPlayer("O");
        setJoined(true);
        setUsername(currentUsername);
        addToast(`Joined room ${targetRoomId} successfully!`, "success");
      } else {
        addToast("Room is full or does not exist!", "error");
      }
    } catch (error) {
      addToast(`Error joining room: ${error.message}`, "error");
    } finally {
      setIsJoiningRoom(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 px-2">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Fading Tic-Tac-Toe</h1>
      {!joined ? (
        <>
          <Lobby
            createRoom={createRoom}
            joinRoom={joinRoom}
            initialUsername="" 
            initialRoomId="" 
            isCreatingRoom={isCreatingRoom}
            isJoiningRoom={isJoiningRoom}
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
            roomId={currentGameRoomId}
            gameData={gameData}
            player={player}
            username={username}
            handleMove={handleMove}
            resetGame={resetGame}
            addToast={addToast} // Pass addToast to Game
          />
        )
      )}
      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default MultiplayerTicTacToe;
