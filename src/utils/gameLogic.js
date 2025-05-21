import { WINNING_COMBINATIONS, PLAYER_X, PLAYER_O } from "../components/constants";

/**
 * Checks if there is a winner on the board.
 * @param {Array<Object|null>} board - The current game board, where each cell is an object { player: string, turn: number } or null.
 * @returns {string|null} The winning player (PLAYER_X or PLAYER_O), or null if no winner.
 */
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

/**
 * Calculates which cell should be highlighted for the current player based on the fading rule.
 * If the turn count is greater than 6, it identifies the oldest mark of the current player.
 * @param {Array<Object|null>} board - The current game board.
 * @param {string} currentPlayer - The player whose turn it is (PLAYER_X or PLAYER_O).
 * @param {number} turnCount - The current turn number.
 * @returns {number|null} The index of the cell to highlight, or null if no cell should be highlighted.
 */
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

/**
 * Determines the next player.
 * @param {string} currentPlayer - The current player (PLAYER_X or PLAYER_O).
 * @returns {string} The next player (PLAYER_O or PLAYER_X).
 */
export const getNextPlayer = (currentPlayer) => (currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X);

/**
 * Checks if the game is over.
 * A game is over if there is a winner or if all cells on the board are filled.
 * @param {Array<Object|null>} board - The current game board.
 * @param {string|null} winner - The winner of the game (PLAYER_X or PLAYER_O), or null if no winner yet.
 * @returns {boolean} True if the game is over, false otherwise.
 */
export const isGameOver = (board, winner) => winner !== null || board.every((cell) => cell !== null);

/**
 * Applies the fading rule to the board.
 * If the turn count is 7 or more, the oldest mark of the current player that has been on the board
 * for at least 6 turns (current turnCount - mark's turnCount >= 6) is removed.
 * @param {Array<Object|null>} board - The current game board.
 * @param {string} player - The player whose mark might fade (PLAYER_X or PLAYER_O).
 * @param {number} turnCount - The current turn count (this is the turn count *before* the current move, used to evaluate the age of existing marks).
 * @returns {Array<Object|null>} A new board array with the fading rule applied.
 */
export const applyFadingRule = (board, player, turnCount) => {
  const newBoard = [...board]; // Work on a copy
  if (turnCount >= 7) {
    // Find the oldest mark for the current player that has been on the board for at least 6 turns
    // (i.e., current turnCount - mark's turnCount >= 6)
    let oldestMarkIndex = -1;
    let minTurn = Infinity;

    for (let i = 0; i < newBoard.length; i++) {
      const cell = newBoard[i];
      if (cell && cell.player === player) {
        if (turnCount - cell.turn >= 6) {
          if (cell.turn < minTurn) {
            minTurn = cell.turn;
            oldestMarkIndex = i;
          }
        }
      }
    }

    if (oldestMarkIndex !== -1) {
      newBoard[oldestMarkIndex] = null;
    }
  }
  return newBoard;
};
