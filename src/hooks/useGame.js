import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { updateGameState } from "../utils/firebaseUtils";
import { 
  checkWinner, 
  calculateHighlightCell, 
  getNextPlayer, 
  isGameOver, 
  applyFadingRule 
} from "../utils/gameLogic";
import { INITIAL_GAME_STATE } from "../components/constants"; // PLAYER_X and PLAYER_O are used by gameLogic

/**
 * @typedef {Object} PlayerMark
 * @property {string} player - The player identifier (PLAYER_X or PLAYER_O).
 * @property {number} turn - The turn number when the mark was placed.
 */

/**
 * @typedef {Array<PlayerMark|null>} BoardState - Represents the 9 cells of the Tic-Tac-Toe board.
 */

/**
 * @typedef {Object} GameData
 * @property {BoardState} board - The current state of the game board.
 * @property {string} currentPlayer - The player whose turn it is.
 * @property {boolean} gameOver - Whether the game has ended.
 * @property {string|null} winner - The winner of the game, if any.
 * @property {number} turnCount - The current turn number.
 * @property {Object.<string, string>} players - Mapping of player marks (PLAYER_X, PLAYER_O) to usernames.
 * @property {Object.<string, number>} scores - Scores for PLAYER_X and PLAYER_O.
 * @property {Array<Object>} gameHistory - A history of completed games in the current session/room.
 * @property {number|null} highlightCell - The index of the cell to highlight for fading.
 * @property {firebase.firestore.Timestamp} [createdAt] - Timestamp of game creation.
 */

/**
 * Helper function to update scores and game history.
 * @param {Object.<string, number>} currentScores - The current scores for PLAYER_X and PLAYER_O.
 * @param {Object.<string, string>} currentPlayers - Mapping of player marks to usernames.
 * @param {Array<Object>} currentHistory - The current game history.
 * @param {string|null} winner - The winner of the game (PLAYER_X, PLAYER_O, or null).
 * @param {number} moves - The number of moves made in the completed game.
 * @returns {{scores: Object.<string, number>, gameHistory: Array<Object>}} The updated scores and game history.
 */
const updateScoresAndHistory = (currentScores, currentPlayers, currentHistory, winner, moves) => {
  const newScores = { ...currentScores };
  if (winner) {
    newScores[winner]++;
  }
  const gameResult = {
    winner: winner,
    winnerName: winner ? currentPlayers[winner] : null,
    moves: moves,
    timestamp: new Date().toISOString(),
  };
  const newGameHistory = [...currentHistory, gameResult];
  return { scores: newScores, gameHistory: newGameHistory };
};

/**
 * Custom hook to manage the game state and logic for a Tic-Tac-Toe game room.
 * It subscribes to real-time game state updates from Firebase and provides functions
 * to handle player moves and reset the game.
 *
 * @param {string} roomId - The ID of the game room in Firebase.
 * @param {string} player - The mark (PLAYER_X or PLAYER_O) of the current user in this client.
 * @returns {{
 *   gameData: GameData|null,
 *   handleMove: (index: number) => Promise<void>,
 *   resetGame: () => Promise<void>
 * }} An object containing the current game data, a function to handle moves,
 *    and a function to reset the game.
 */
const useGame = (roomId, player) => {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const gameDoc = doc(db, "games", roomId);
    const unsubscribe = onSnapshot(gameDoc, (docSnap) => {
      if (docSnap.exists()) {
        setGameData(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  /**
   * Handles a player's move on the Tic-Tac-Toe board.
   * This function is called when the current user clicks on a square.
   * It updates the board, applies fading rules, checks for a winner,
   * determines if the game is over, and then updates the game state in Firebase.
   *
   * @param {number} index - The index of the square (0-8) where the move is made.
   * @returns {Promise<void>} A promise that resolves when the move has been processed and state updated.
   */
  const handleMove = useCallback(
    async (index) => {
      if (!gameData || gameData.gameOver || gameData.board[index] || gameData.currentPlayer !== player)
        return;

      let boardAfterMove = [...gameData.board];
      boardAfterMove[index] = { player, turn: gameData.turnCount };

      // Apply fading rule
      // The player whose mark might fade is the current player, and we use the turn count *before* this move for evaluating fading.
      boardAfterMove = applyFadingRule(boardAfterMove, player, gameData.turnCount); 
      
      const nextPlayer = getNextPlayer(gameData.currentPlayer);
      const newTurnCount = gameData.turnCount + 1;
      // newWinner, gameOver, and highlightCell should be calculated based on the board *after* fading.
      const newWinner = checkWinner(boardAfterMove);
      const gameOver = isGameOver(boardAfterMove, newWinner);
      const highlightCell = calculateHighlightCell(boardAfterMove, nextPlayer, newTurnCount);

      const newState = {
        board: boardAfterMove,
        currentPlayer: nextPlayer,
        turnCount: newTurnCount,
        highlightCell,
        gameOver,
        winner: newWinner,
      };

      if (gameOver) {
        const { scores: updatedScores, gameHistory: updatedGameHistory } = updateScoresAndHistory(
          gameData.scores,
          gameData.players,
          gameData.gameHistory,
          newWinner,
          newTurnCount - 1 
        );
        newState.scores = updatedScores;
        newState.gameHistory = updatedGameHistory;
      }

      try {
        await updateGameState(roomId, newState);
      } catch (error) {
        console.error("Error updating game state in handleMove:", error);
        // Depending on requirements, you might want to set an error state here
        // to inform the user, but for now, just logging.
      }
    },
    [gameData, player, roomId]
  );

  /**
   * Resets the current game to its initial state.
   * This involves clearing the board, resetting the current player to PLAYER_X,
   * and resetting turn count, game over status, and winner.
   * The scores and game history are preserved.
   * The updated state is then saved to Firebase.
   *
   * @returns {Promise<void>} A promise that resolves when the game has been reset.
   */
  const resetGame = useCallback(async () => {
    if (!gameData) return;
    try {
      // Preserve players, scores, and gameHistory from the current gameData
      const { players, scores, gameHistory } = gameData;
      await updateGameState(roomId, {
        ...INITIAL_GAME_STATE, // Resets board, currentPlayer, gameOver, winner, turnCount, highlightCell
        players,              // Keep existing players
        scores,               // Keep existing scores
        gameHistory,          // Keep existing game history
      });
    } catch (error) {
      console.error("Error resetting game state:", error);
      // Depending on requirements, you might want to set an error state here.
    }
  }, [gameData, roomId]);

  return { gameData, handleMove, resetGame };
};

export default useGame;
