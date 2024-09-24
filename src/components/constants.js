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

export const INITIAL_GAME_STATE = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  gameOver: false,
  winner: null,
  turnCount: 1,
  players: {},
  scores: { X: 0, O: 0 },
  gameHistory: [],
  highlightCell: null,
};
