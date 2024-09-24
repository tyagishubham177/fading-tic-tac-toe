import React, { useState, useEffect } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import Rules from "./Rules";
import { db } from "../firebase";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { Info } from "lucide-react";

const MultiplayerTicTacToe = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [gameData, setGameData] = useState({
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameOver: false,
    winner: null,
    turnCount: 1,
    players: {},
    scores: { X: 0, O: 0 },
    gameHistory: [],
    highlightCell: null,
  });

  useEffect(() => {
    let unsubscribe;
    if (joined && roomId) {
      const gameDoc = doc(db, "games", roomId);
      unsubscribe = onSnapshot(gameDoc, (docSnap) => {
        if (docSnap.exists()) {
          setGameData(docSnap.data());
        } else {
          alert("Room does not exist!");
          setJoined(false);
          setRoomId("");
        }
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [joined, roomId]);

  const createRoom = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    const newRoomId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const gameDoc = doc(db, "games", newRoomId);
    await setDoc(gameDoc, {
      board: Array(9).fill(null),
      currentPlayer: "X",
      gameOver: false,
      winner: null,
      turnCount: 1,
      players: {
        X: username,
      },
      scores: { X: 0, O: 0 },
      gameHistory: [],
      highlightCell: null,
      createdAt: serverTimestamp(),
    });
    setRoomId(newRoomId);
    setPlayer("X");
    setJoined(true);
  };

  const joinRoom = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    const gameDoc = doc(db, "games", roomId);
    const docSnap = await getDoc(gameDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || {};
      if (!players.O) {
        await updateDoc(gameDoc, {
          "players.O": username,
        });
        setPlayer("O");
        setJoined(true);
      } else {
        alert("Room is full!");
      }
    } else {
      alert("Room does not exist!");
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
        <Game roomId={roomId} gameData={gameData} player={player} username={username} />
      )}
      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default MultiplayerTicTacToe;
