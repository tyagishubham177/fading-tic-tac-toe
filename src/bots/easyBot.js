const pick = (moves, rng) => moves[Math.floor(rng() * moves.length)];

export const chooseEasyMove = (state, tools) => {
  const { applyMove, getLegalMoves, rng = Math.random } = tools;
  const legalMoves = getLegalMoves(state);
  const winningMoves = legalMoves.filter((move) => applyMove(state, move).winner === state.currentPlayer);
  if (winningMoves.length && rng() < 0.7) return pick(winningMoves, rng);

  const opponentState = {
    ...state,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
  };
  const blocks = legalMoves.filter((move) => applyMove(opponentState, move).winner === opponentState.currentPlayer);
  if (blocks.length && rng() < 0.55) return pick(blocks, rng);

  const weightedMoves = legalMoves.flatMap((move) => {
    const weight = move === 4 ? 4 : [0, 2, 6, 8].includes(move) ? 2 : 1;
    return Array(weight).fill(move);
  });
  return pick(weightedMoves, rng);
};
