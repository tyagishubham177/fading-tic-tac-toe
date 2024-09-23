// src/components/MultiplayerTicTacToe.js
import React, { useState, useEffect } from "react";
import { X, Circle } from "lucide-react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

const BOARD_SIZE = 3;
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

  const handleClick = async (index) => {
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
    await updateDoc(doc(db, "games", roomId), {
      board: Array(9).fill(null),
      currentPlayer: "X",
      gameOver: false,
      winner: null,
      turnCount: 1,
    });
  };

  const renderSquare = (index) => {
    const cell = gameData.board[index];
    return (
      <button
        key={index}
        className={`w-20 h-20 border border-gray-400 flex items-center justify-center text-4xl
                  ${cell?.fading ? "bg-yellow-200" : ""}`}
        onClick={() => handleClick(index)}
      >
        {cell?.player === "X" && <X className="text-blue-500" />}
        {cell?.player === "O" && <Circle className="text-red-500" />}
      </button>
    );
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Fading Tic-Tac-Toe</h1>
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
            onClick={createRoom}
          >
            Create Room
          </button>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Fading Tic-Tac-Toe</h1>
      <div className="mb-4">
        <p className="text-xl font-semibold">
          Room ID: <span className="font-mono">{roomId}</span>
        </p>
        <p className="text-xl font-semibold">
          {gameData.gameOver
            ? gameData.winner
              ? `Winner: ${gameData.winner}`
              : "It's a Draw!"
            : `Current Player: ${gameData.currentPlayer}`}
        </p>
        <p className="text-lg mt-2">You are: {player}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {gameData.board.map((_, index) => renderSquare(index))}
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
        disabled={!gameData.gameOver}
      >
        Reset Game
      </button>
      <p className="mt-4 text-sm text-gray-600">Turn: {gameData.turnCount}</p>
    </div>
  );
};

export default MultiplayerTicTacToe;
