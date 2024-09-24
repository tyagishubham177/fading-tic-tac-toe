import { WINNING_COMBINATIONS } from "../components/constants";

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

export const calculateHighlightCell = (board, currentPlayer, turnCount) => {
  if (turnCount > 6) {
    const playerMarks = board
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell && cell.player === currentPlayer)
      .sort((a, b) => a.cell.turn - b.cell.turn);
    if (playerMarks.length > 0) {
      return playerMarks[0].index;
    }
  }
  return null;
};

export const getNextPlayer = (currentPlayer) => (currentPlayer === "X" ? "O" : "X");

export const isGameOver = (board, winner) => winner !== null || board.every((cell) => cell !== null);
