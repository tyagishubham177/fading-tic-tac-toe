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

export const PLAYER_X = "X";
export const PLAYER_O = "O";

export const INITIAL_GAME_STATE = {
  board: Array(9).fill(null),
  currentPlayer: PLAYER_X,
  gameOver: false,
  winner: null,
  turnCount: 1,
  players: {},
  scores: { [PLAYER_X]: 0, [PLAYER_O]: 0 },
  gameHistory: [],
  highlightCell: null,
};
