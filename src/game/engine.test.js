import { applyMove, createInitialState, getHighlightCell, getLegalMoves } from "./engine";

const play = (moves) => moves.reduce((state, move) => applyMove(state, move), createInitialState());

test("detects a win using the fading rules", () => {
  const state = play([0, 3, 1, 4, 2]);
  expect(state.winner).toBe("X");
  expect(state.gameOver).toBe(true);
  expect(getLegalMoves(state)).toEqual([]);
});

test("removes a player's oldest mark on their fourth move", () => {
  const state = play([0, 1, 2, 3, 7, 8, 4]);
  expect(state.board[0]).toBeNull();
  expect(state.board[4]).toMatchObject({ player: "X", turn: 7 });
  expect(state.board.filter((cell) => cell?.player === "X")).toHaveLength(3);
});

test("highlights the next mark that will fade", () => {
  const state = play([0, 1, 2, 3, 7, 8]);
  expect(state.currentPlayer).toBe("X");
  expect(getHighlightCell(state)).toBe(0);
});

test("rejects occupied cells", () => {
  const state = applyMove(createInitialState(), 0);
  expect(() => applyMove(state, 0)).toThrow("Illegal move: 0");
});
