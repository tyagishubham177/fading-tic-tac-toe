import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import Rules from "./Rules";
import { createGameRoom, joinGameRoom } from "../utils/firebaseUtils";
import useGame from "../hooks/useGame";
import { Bot, Info, Users } from "lucide-react";
import BotSetup from "./BotSetup";
import BotGame from "./BotGame";

const MultiplayerTicTacToe = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [mode, setMode] = useState(null);
  const [botOptions, setBotOptions] = useState(null);

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

  if (botOptions) {
    return <BotGame {...botOptions} onExit={() => setBotOptions(null)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 px-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Fading Tic-Tac-Toe</h1>
      {!joined && !mode ? (
        <section className="mode-panel" aria-labelledby="mode-heading">
          <p className="eyebrow">Choose a game</p>
          <h2 id="mode-heading">How do you want to play?</h2>
          <div className="mode-grid">
            <button className="mode-card bot-mode" onClick={() => setMode("bot")}>
              <Bot size={32} />
              <strong>Play vs bot</strong>
              <span>Easy, Medium, or a self-play-trained Hard opponent.</span>
            </button>
            <button className="mode-card" onClick={() => setMode("online")}>
              <Users size={32} />
              <strong>Play online</strong>
              <span>Create a room or join a friend with a room code.</span>
            </button>
          </div>
          <button onClick={() => setShowRules(true)} className="rules-link"><Info size={18} /> Game rules</button>
        </section>
      ) : !joined && mode === "bot" ? (
        <BotSetup
          defaultUsername={username}
          onBack={() => setMode(null)}
          onStart={(options) => {
            setUsername(options.username);
            setBotOptions(options);
          }}
        />
      ) : !joined ? (
        <>
          <button className="text-button lobby-back" onClick={() => setMode(null)}>← Back to modes</button>
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
