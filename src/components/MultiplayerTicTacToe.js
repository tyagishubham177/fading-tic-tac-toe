// src/components/MultiplayerTicTacToe.js
import React, { useState, useEffect } from "react";
import Lobby from "./Lobby";
import GameBoard from "./GameBoard";
import Status from "./Status";
import ResetButton from "./ResetButton";
import { db } from "../firebase";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const MultiplayerTicTacToe = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [player, setPlayer] = useState(null); // 'X' or 'O'
  const [gameData, setGameData] = useState({
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameOver: false,
    winner: null,
    turnCount: 1,
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
    const newRoomId = Math.random().toString(36).substr(2, 9);
    const gameDoc = doc(db, "games", newRoomId);
    await setDoc(gameDoc, {
      board: Array(9).fill(null),
      currentPlayer: "X",
      gameOver: false,
      winner: null,
      turnCount: 1,
      players: {
        X: true,
      },
      createdAt: serverTimestamp(),
    });
    setRoomId(newRoomId);
    setPlayer("X");
    setJoined(true);
  };

  const joinRoom = async () => {
    const gameDoc = doc(db, "games", roomId);
    const docSnap = await getDoc(gameDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || {};
      if (!players.O) {
        await updateDoc(gameDoc, {
          [`players.O`]: true,
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

  const handleMove = async (index) => {
    if (gameData.gameOver || gameData.board[index] || gameData.currentPlayer !== player) return;

    const newBoard = [...gameData.board];
    newBoard[index] = { player, turn: gameData.turnCount };

    // Remove the oldest mark of the current player if turnCount >=7
    if (gameData.turnCount >= 7) {
      const currentPlayer = player;
      const oldestMarkIndex = newBoard.findIndex(
        (cell) => cell && cell.player === currentPlayer && gameData.turnCount - cell.turn >= 6
      );
      if (oldestMarkIndex !== -1) {
        newBoard[oldestMarkIndex] = null;
      }
    }

    const nextPlayer = gameData.currentPlayer === "X" ? "O" : "X";
    const newTurnCount = gameData.turnCount + 1;

    // Check for winner
    let newWinner = null;
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[b] &&
        newBoard[c] &&
        newBoard[a].player === newBoard[b].player &&
        newBoard[b].player === newBoard[c].player
      ) {
        newWinner = newBoard[a].player;
        break;
      }
    }

    const isGameOver = newWinner !== null || newBoard.every((cell) => cell !== null);

    await updateDoc(doc(db, "games", roomId), {
      board: newBoard,
      currentPlayer: isGameOver ? gameData.currentPlayer : nextPlayer,
      gameOver: isGameOver,
      winner: newWinner,
      turnCount: newTurnCount,
    });
  };

  const resetGame = async () => {
    if (!roomId) return;
    await updateDoc(doc(db, "games", roomId), {
      board: Array(9).fill(null),
      currentPlayer: "X",
      gameOver: false,
      winner: null,
      turnCount: 1,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <h1 className="text-4xl font-extrabold text-white mb-8">Fading Tic-Tac-Toe</h1>
      {!joined ? (
        <Lobby createRoom={createRoom} joinRoom={joinRoom} roomId={roomId} setRoomId={setRoomId} />
      ) : (
        <>
          <Status roomId={roomId} gameData={gameData} player={player} />
          <GameBoard board={gameData.board} handleMove={handleMove} />
          <ResetButton resetGame={resetGame} gameOver={gameData.gameOver} />
        </>
      )}
    </div>
  );
};

export default MultiplayerTicTacToe;
