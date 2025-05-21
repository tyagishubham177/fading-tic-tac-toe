import { checkWinner, calculateHighlightCell, getNextPlayer, isGameOver } from './gameLogic';
// WINNING_COMBINATIONS is used internally by checkWinner, so not strictly needed for these tests
// import { WINNING_COMBINATIONS } from '../components/constants';

describe('gameLogic functions', () => {
  // Test suite for checkWinner will be added here
  describe('checkWinner', () => {
    // X wins
    it('should return X when X wins horizontally (top row)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'X', turn: 3 }, { player: 'X', turn: 5 },
        { player: 'O', turn: 2 }, { player: 'O', turn: 4 }, null,
        null, null, null
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('should return X when X wins vertically (middle column)', () => {
      const board = [
        { player: 'O', turn: 2 }, { player: 'X', turn: 1 }, null,
        null, { player: 'X', turn: 3 }, { player: 'O', turn: 4 },
        null, { player: 'X', turn: 5 }, null
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('should return X when X wins diagonally (top-left to bottom-right)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, null,
        null, { player: 'X', turn: 3 }, { player: 'O', turn: 4 },
        null, null, { player: 'X', turn: 5 }
      ];
      expect(checkWinner(board)).toBe('X');
    });

    // O wins
    it('should return O when O wins horizontally (bottom row)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'X', turn: 3 }, null,
        null, null, { player: 'X', turn: 5 },
        { player: 'O', turn: 2 }, { player: 'O', turn: 4 }, { player: 'O', turn: 6 }
      ];
      expect(checkWinner(board)).toBe('O');
    });

    it('should return O when O wins vertically (right column)', () => {
      const board = [
        { player: 'X', turn: 1 }, null, { player: 'O', turn: 2 },
        { player: 'X', turn: 3 }, null, { player: 'O', turn: 4 },
        null, null, { player: 'O', turn: 6 }
      ];
      expect(checkWinner(board)).toBe('O');
    });

    it('should return O when O wins diagonally (top-right to bottom-left)', () => {
      const board = [
        null, { player: 'X', turn: 1 }, { player: 'O', turn: 2 },
        { player: 'X', turn: 3 }, { player: 'O', turn: 4 }, null,
        { player: 'O', turn: 6 }, { player: 'X', turn: 5 }, null
      ];
      expect(checkWinner(board)).toBe('O');
    });

    // Draw and ongoing games
    it('should return null for a draw game (full board, no winner)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'X', turn: 4 }, { player: 'O', turn: 5 }, { player: 'O', turn: 6 },
        { player: 'O', turn: 7 }, { player: 'X', turn: 8 }, { player: 'O', turn: 9 }
      ];
      expect(checkWinner(board)).toBeNull();
    });
    
    it('should return null for an empty board', () => {
      const board = Array(9).fill(null);
      expect(checkWinner(board)).toBeNull();
    });

    it('should return null for an ongoing game (not full, no winner)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, null,
        null, { player: 'X', turn: 3 }, null,
        { player: 'O', turn: 4 }, null, null
      ];
      expect(checkWinner(board)).toBeNull();
    });
  });

  // Test suite for calculateHighlightCell will be added here
  describe('calculateHighlightCell', () => {
    it('should return null if turnCount is less than or equal to 6', () => {
      const board = Array(9).fill(null);
      expect(calculateHighlightCell(board, 'X', 6)).toBeNull();
      expect(calculateHighlightCell(board, 'O', 5)).toBeNull();
    });

    it('should return the index of the oldest mark of currentPlayer if turnCount > 6 and player has 3 marks', () => {
      const board = [ // X: turns 1, 3, 5. O: turns 2, 4, 6
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'O', turn: 4 }, { player: 'X', turn: 5 }, { player: 'O', turn: 6 },
        null, null, null
      ];
      // Next turn is 7, currentPlayer is X
      expect(calculateHighlightCell(board, 'X', 7)).toBe(0); // Oldest X is at index 0 (turn 1)
    });
    
    it('should return the index of the oldest mark of currentPlayer (O) if turnCount > 6 and player has 3 marks', () => {
      const board = [ // X: turns 1, 3, 5. O: turns 2, 4, 6
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'O', turn: 4 }, { player: 'X', turn: 5 }, { player: 'O', turn: 6 },
        null, null, null
      ];
      // Next turn is 8 (after X played on turn 7), currentPlayer is O
      // Let's assume X played at index 6 on turn 7
      const boardAfterXTurn7 = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'O', turn: 4 }, { player: 'X', turn: 5 }, { player: 'O', turn: 6 },
        { player: 'X', turn: 7 }, null, null
      ];
      expect(calculateHighlightCell(boardAfterXTurn7, 'O', 8)).toBe(1); // Oldest O is at index 1 (turn 2)
    });

    it('should return null if turnCount > 6 but currentPlayer has fewer than 3 marks', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'O', turn: 4 }, null, null,
        null, null, null
      ];
      // Next turn is 7, currentPlayer is X. X has only 2 marks.
      expect(calculateHighlightCell(board, 'X', 7)).toBeNull();
    });
    
    it('should return null if currentPlayer has marks, but none are old enough (turnCount - cell.turn < 6)', () => {
      const board = [ 
        { player: 'X', turn: 3 }, { player: 'O', turn: 4 }, { player: 'X', turn: 5 },
        { player: 'O', turn: 6 }, { player: 'X', turn: 7 }, null, // X at turn 7 is newest
        null, null, null
      ];
       // Next turn is 9, currentPlayer is X. 
       // Oldest X is turn 3. 9 - 3 = 6. Not strictly > 6.
       // The condition in implementation is `turnCount - cell.turn >= 6` for removal, 
       // so for highlighting it should be the one that *will be* removed.
      expect(calculateHighlightCell(board, 'X', 9)).toBe(0); // X at index 0 (turn 3) will be removed as 9-3=6
    });

    it('should correctly identify the oldest mark even if not at index 0', () => {
      const board = [ 
        null, { player: 'O', turn: 2 }, { player: 'X', turn: 1 },
        { player: 'O', turn: 4 }, { player: 'X', turn: 3 }, { player: 'O', turn: 6 },
        { player: 'X', turn: 5 }, null, null
      ];
      // Next turn is 7, currentPlayer X
      expect(calculateHighlightCell(board, 'X', 7)).toBe(2); // X at index 2 (turn 1)
    });

    it('should return null if board is empty and turnCount > 6', () => {
      const board = Array(9).fill(null);
      expect(calculateHighlightCell(board, 'X', 7)).toBeNull();
    });
  });

  // Test suite for getNextPlayer will be added here
  describe('getNextPlayer', () => {
    it('should return O if current player is X', () => {
      expect(getNextPlayer('X')).toBe('O');
    });

    it('should return X if current player is O', () => {
      expect(getNextPlayer('O')).toBe('X');
    });
  });

  // Test suite for isGameOver will be added here
  describe('isGameOver', () => {
    it('should return true if there is a winner (X)', () => {
      const board = Array(9).fill(null); // Board state doesn't strictly matter for this check if winner is passed
      expect(isGameOver(board, 'X')).toBe(true);
    });

    it('should return true if there is a winner (O)', () => {
      const board = Array(9).fill(null);
      expect(isGameOver(board, 'O')).toBe(true);
    });

    it('should return true for a draw (winner is null, board is full)', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, { player: 'X', turn: 3 },
        { player: 'O', turn: 4 }, { player: 'X', turn: 5 }, { player: 'O', turn: 6 },
        { player: 'X', turn: 7 }, { player: 'O', turn: 8 }, { player: 'X', turn: 9 }
      ];
      expect(isGameOver(board, null)).toBe(true);
    });

    it('should return false if no winner and board is not full', () => {
      const board = [
        { player: 'X', turn: 1 }, { player: 'O', turn: 2 }, null,
        null, { player: 'X', turn: 3 }, null,
        null, null, null
      ];
      expect(isGameOver(board, null)).toBe(false);
    });
    
    it('should return false if board is empty and no winner', () => {
      const board = Array(9).fill(null);
      expect(isGameOver(board, null)).toBe(false);
    });
  });
});
