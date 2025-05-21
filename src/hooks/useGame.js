import { useState, useEffect, useCallback } from "react";
import { subscribeToGameUpdates, updateGameState } from "../utils/firebaseUtils";
import { checkWinner, calculateHighlightCell, getNextPlayer, isGameOver } from "../utils/gameLogic";

export const calculateScoreAndHistoryUpdate = (currentWinner, currentScores, currentPlayers, currentTurnCount, existingGameHistory) => {
  let updatedScores = { ...currentScores };
  if (currentWinner) {
    updatedScores[currentWinner]++;
  }

  const gameResult = {
    winner: currentWinner,
    winnerName: currentWinner ? currentPlayers[currentWinner] : null,
    moves: currentTurnCount - 1, // Assuming turnCount is already incremented for the current move
    timestamp: new Date().toISOString(),
  };

  const updatedGameHistory = [...existingGameHistory, gameResult];

  return { updatedScores, updatedGameHistory };
};

const useGame = (roomId, player) => {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (!roomId) {
      setGameData(null); 
      return;
    }

    const unsubscribe = subscribeToGameUpdates(roomId, (data) => {
      setGameData(data);
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleMove = useCallback(
    async (index) => {
      if (!gameData || gameData.gameOver || gameData.board[index] || gameData.currentPlayer !== player)
        return;

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

      const nextPlayer = getNextPlayer(gameData.currentPlayer);
      const newTurnCount = gameData.turnCount + 1;
      const newWinner = checkWinner(newBoard);
      const gameOver = isGameOver(newBoard, newWinner);
      const highlightCell = calculateHighlightCell(newBoard, nextPlayer, newTurnCount);

      const newState = {
        board: newBoard,
        currentPlayer: nextPlayer,
        turnCount: newTurnCount,
        highlightCell,
        gameOver,
        winner: newWinner,
      };

      if (gameOver) {
        const { updatedScores, updatedGameHistory } = calculateScoreAndHistoryUpdate(
          newWinner,
          gameData.scores,
          gameData.players,
          newTurnCount,
          gameData.gameHistory
        );
        newState.scores = updatedScores;
        newState.gameHistory = updatedGameHistory;
      }

      await updateGameState(roomId, newState);
    },
    [gameData, player, roomId]
  );

  const resetGame = useCallback(async () => {
    if (!gameData) return;
    await updateGameState(roomId, {
      board: Array(9).fill(null),
      currentPlayer: "X",
      gameOver: false,
      winner: null,
      turnCount: 1,
      highlightCell: null,
      // Scores and gameHistory remain as they are on manual reset
    });
  }, [gameData, roomId]);

  return { gameData, handleMove, resetGame };
};

export default useGame;
