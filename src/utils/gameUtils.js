// src/utils/gameUtils.js
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const handleMove = async (index, roomId, gameData, player) => {
  if (gameData.gameOver || gameData.board[index] || gameData.currentPlayer !== player) return;

  const newBoard = [...gameData.board];
  newBoard[index] = { player, turn: gameData.turnCount };

  if (gameData.turnCount >= 7) {
    const oldestMarkIndex = newBoard.findIndex(
      (cell) => cell && cell.player === player && gameData.turnCount - cell.turn >= 6
    );
    if (oldestMarkIndex !== -1) {
      newBoard[oldestMarkIndex] = null;
    }
  }

  const nextPlayer = gameData.currentPlayer === "X" ? "O" : "X";
  const newTurnCount = gameData.turnCount + 1;

  let newWinner = checkWinner(newBoard);
  const isGameOver = newWinner !== null || newBoard.every((cell) => cell !== null);

  if (isGameOver) {
    const newScores = { ...gameData.scores };
    if (newWinner) {
      newScores[newWinner]++;
    }
    const gameResult = {
      winner: newWinner,
      winnerName: newWinner ? gameData.players[newWinner] : null,
      moves: newTurnCount - 1,
      timestamp: new Date().toISOString(),
    };
    await updateDoc(doc(db, "games", roomId), {
      board: newBoard,
      currentPlayer: gameData.currentPlayer,
      gameOver: true,
      winner: newWinner,
      turnCount: newTurnCount,
      scores: newScores,
      gameHistory: arrayUnion(gameResult),
    });
  } else {
    await updateDoc(doc(db, "games", roomId), {
      board: newBoard,
      currentPlayer: nextPlayer,
      turnCount: newTurnCount,
    });
  }
};

export const resetGame = async (roomId, players) => {
  await updateDoc(doc(db, "games", roomId), {
    board: Array(9).fill(null),
    currentPlayer: "X",
    gameOver: false,
    winner: null,
    turnCount: 1,
    players: players, // Keep the same player assignments
  });
};

export const checkWinner = (board) => {
  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[b] &&
      board[c] &&
      board[a].player === board[b].player &&
      board[b].player === board[c].player
    ) {
      return board[a].player;
    }
  }
  return null;
};

export const calculateHighlightCell = (gameData, player) => {
  if (gameData.currentPlayer === player && gameData.turnCount > 6) {
    const playerMarks = gameData.board
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell && cell.player === player)
      .sort((a, b) => a.cell.turn - b.cell.turn);
    if (playerMarks.length >= 1) {
      return playerMarks[0].index;
    }
  }
  return null;
};
