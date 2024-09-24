import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { updateGameState } from "../utils/firebaseUtils";
import { checkWinner, calculateHighlightCell, getNextPlayer, isGameOver } from "../utils/gameLogic";

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
        newState.scores = newScores;
        newState.gameHistory = [...gameData.gameHistory, gameResult];
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
    });
  }, [gameData, roomId]);

  return { gameData, handleMove, resetGame };
};

export default useGame;
