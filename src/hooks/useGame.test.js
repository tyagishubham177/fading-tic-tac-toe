import { calculateScoreAndHistoryUpdate } from './useGame';

describe('calculateScoreAndHistoryUpdate', () => {
  // Mock Date.now() to control timestamp for consistent testing
  let originalDateNow;
  const mockTimestamp = new Date('2024-01-01T12:00:00.000Z').toISOString();

  beforeAll(() => {
    originalDateNow = Date.now;
    global.Date.now = jest.fn(() => new Date(mockTimestamp).getTime());
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });
  
  // Test Case 1: Player 'X' wins
  it('should correctly update scores and history when X wins', () => {
    const currentWinner = 'X';
    const currentScores = { X: 0, O: 0 };
    const currentPlayers = { X: 'PlayerX', O: 'PlayerO' };
    const currentTurnCount = 7; // This is newTurnCount (gameData.turnCount + 1)
    const existingGameHistory = [];

    const { updatedScores, updatedGameHistory } = calculateScoreAndHistoryUpdate(
      currentWinner,
      currentScores,
      currentPlayers,
      currentTurnCount,
      existingGameHistory
    );

    expect(updatedScores).toEqual({ X: 1, O: 0 });
    expect(updatedGameHistory).toHaveLength(1);
    expect(updatedGameHistory[0]).toEqual({
      winner: 'X',
      winnerName: 'PlayerX',
      moves: 6, // currentTurnCount - 1
      timestamp: mockTimestamp,
    });
  });

  // Test Case 2: Player 'O' wins, existing history
  it('should correctly update scores and append to existing history when O wins', () => {
    const currentWinner = 'O';
    const currentScores = { X: 1, O: 2 };
    const currentPlayers = { X: 'PlayerX', O: 'PlayerO' };
    const currentTurnCount = 9;
    const existingGameHistory = [{
      winner: 'X',
      winnerName: 'PlayerX',
      moves: 7,
      timestamp: new Date('2023-12-31T10:00:00.000Z').toISOString(),
    }];

    const { updatedScores, updatedGameHistory } = calculateScoreAndHistoryUpdate(
      currentWinner,
      currentScores,
      currentPlayers,
      currentTurnCount,
      existingGameHistory
    );

    expect(updatedScores).toEqual({ X: 1, O: 3 });
    expect(updatedGameHistory).toHaveLength(2);
    expect(updatedGameHistory[0]).toEqual(existingGameHistory[0]); // Ensure existing history is preserved
    expect(updatedGameHistory[1]).toEqual({
      winner: 'O',
      winnerName: 'PlayerO',
      moves: 8, // currentTurnCount - 1
      timestamp: mockTimestamp,
    });
  });

  // Test Case 3: Draw game
  it('should correctly update scores (unchanged) and history for a draw game', () => {
    const currentWinner = null;
    const currentScores = { X: 1, O: 1 };
    const currentPlayers = { X: 'PlayerX', O: 'PlayerO' };
    const currentTurnCount = 10;
    const existingGameHistory = [];

    const { updatedScores, updatedGameHistory } = calculateScoreAndHistoryUpdate(
      currentWinner,
      currentScores,
      currentPlayers,
      currentTurnCount,
      existingGameHistory
    );

    expect(updatedScores).toEqual({ X: 1, O: 1 });
    expect(updatedGameHistory).toHaveLength(1);
    expect(updatedGameHistory[0]).toEqual({
      winner: null,
      winnerName: null,
      moves: 9, // currentTurnCount - 1
      timestamp: mockTimestamp,
    });
  });

  // Test Case 4: Winner, but currentPlayers object might be missing a player name
  it('should handle missing player name gracefully', () => {
    const currentWinner = 'X';
    const currentScores = { X: 0, O: 0 };
    const currentPlayers = { O: 'PlayerO' }; // 'X' is missing
    const currentTurnCount = 5;
    const existingGameHistory = [];

    const { updatedScores, updatedGameHistory } = calculateScoreAndHistoryUpdate(
      currentWinner,
      currentScores,
      currentPlayers,
      currentTurnCount,
      existingGameHistory
    );

    expect(updatedScores).toEqual({ X: 1, O: 0 });
    expect(updatedGameHistory).toHaveLength(1);
    expect(updatedGameHistory[0]).toEqual({
      winner: 'X',
      winnerName: null, // Expected because currentPlayers.X is undefined
      moves: 4, // currentTurnCount - 1
      timestamp: mockTimestamp,
    });
  });
});
