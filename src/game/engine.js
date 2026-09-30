import { PLAYER_O, PLAYER_X, WINNING_COMBINATIONS } from "../components/constants";

export const MAX_PLIES = 100;
export const REPETITION_LIMIT = 3;

export const createInitialState = (startingPlayer = PLAYER_X) => {
  const state = {
    board: Array(9).fill(null),
    currentPlayer: startingPlayer,
    turnCount: 1,
    winner: null,
    gameOver: false,
    drawReason: null,
    repetitions: {},
  };
  const key = getPositionKey(state);
  return { ...state, repetitions: { [key]: 1 } };
};

export const getWinner = (board) => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (
      board[a] &&
      board[b] &&
      board[c] &&
      board[a].player === board[b].player &&
      board[a].player === board[c].player
    ) {
      return board[a].player;
    }
  }
  return null;
};

export const getLegalMoves = (state) => {
  if (state.gameOver) return [];
  return state.board.reduce((moves, cell, index) => {
    if (!cell) moves.push(index);
    return moves;
  }, []);
};

const normalizeBoard = (board) => {
  const ranks = {};
  [PLAYER_X, PLAYER_O].forEach((player) => {
    board
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell?.player === player)
      .sort((a, b) => a.cell.turn - b.cell.turn)
      .forEach(({ index }, rank) => {
        ranks[index] = rank + 1;
      });
  });
  return board.map((cell, index) => (cell ? `${cell.player}${ranks[index]}` : "-")).join("");
};

export const getPositionKey = (state) => `${state.currentPlayer}:${normalizeBoard(state.board)}`;

export const getHighlightCell = (state) => {
  const marks = state.board
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => cell?.player === state.currentPlayer)
    .sort((a, b) => a.cell.turn - b.cell.turn);
  return marks.length === 3 ? marks[0].index : null;
};

export const applyMove = (state, cellIndex) => {
  if (!getLegalMoves(state).includes(cellIndex)) {
    throw new Error(`Illegal move: ${cellIndex}`);
  }

  const player = state.currentPlayer;
  const board = [...state.board];
  board[cellIndex] = { player, turn: state.turnCount };

  const playerMarks = board
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => cell?.player === player)
    .sort((a, b) => a.cell.turn - b.cell.turn);
  if (playerMarks.length > 3) board[playerMarks[0].index] = null;

  const winner = getWinner(board);
  const nextPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;
  const nextTurnCount = state.turnCount + 1;
  const nextState = {
    ...state,
    board,
    currentPlayer: nextPlayer,
    turnCount: nextTurnCount,
    winner,
    gameOver: Boolean(winner),
    drawReason: null,
  };

  if (winner) return nextState;

  const key = getPositionKey(nextState);
  const repetitions = {
    ...state.repetitions,
    [key]: (state.repetitions[key] || 0) + 1,
  };
  const repeated = repetitions[key] >= REPETITION_LIMIT;
  const moveLimitReached = nextTurnCount > MAX_PLIES;

  return {
    ...nextState,
    repetitions,
    gameOver: repeated || moveLimitReached,
    drawReason: repeated ? "repetition" : moveLimitReached ? "move-limit" : null,
  };
};

export const toGameData = (state, players, scores, gameHistory = []) => ({
  ...state,
  players,
  scores,
  gameHistory,
  highlightCell: getHighlightCell(state),
});
