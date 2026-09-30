import { WINNING_COMBINATIONS } from "../components/constants";

export const tacticalScore = (state, player) => {
  if (state.winner) return state.winner === player ? 10000 : -10000;
  if (state.gameOver) return 0;
  const opponent = player === "X" ? "O" : "X";
  let score = 0;
  for (const combo of WINNING_COMBINATIONS) {
    const values = combo.map((index) => state.board[index]?.player);
    const own = values.filter((value) => value === player).length;
    const other = values.filter((value) => value === opponent).length;
    if (!other) score += own === 2 ? 18 : own === 1 ? 3 : 1;
    if (!own) score -= other === 2 ? 20 : other === 1 ? 3 : 1;
  }
  if (state.board[4]?.player === player) score += 4;
  if (state.board[4]?.player === opponent) score -= 4;
  return score;
};

export const findBestMove = (state, tools, options = {}) => {
  const {
    depth = 7,
    deadline = Infinity,
    evaluate = tacticalScore,
    rng = Math.random,
  } = options;
  const rootPlayer = state.currentPlayer;
  const cache = new Map();

  const minimax = (position, remaining, alpha, beta) => {
    if (Date.now() >= deadline) throw new Error("SEARCH_TIMEOUT");
    if (position.gameOver || remaining === 0) return evaluate(position, rootPlayer);
    const cacheKey = `${tools.getPositionKey(position)}:${remaining}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const maximizing = position.currentPlayer === rootPlayer;
    let best = maximizing ? -Infinity : Infinity;
    for (const move of tools.getLegalMoves(position)) {
      const value = minimax(tools.applyMove(position, move), remaining - 1, alpha, beta);
      if (maximizing) {
        best = Math.max(best, value);
        alpha = Math.max(alpha, best);
      } else {
        best = Math.min(best, value);
        beta = Math.min(beta, best);
      }
      if (beta <= alpha) break;
    }
    cache.set(cacheKey, best);
    return best;
  };

  let bestMoves = [];
  let bestScore = -Infinity;
  for (const move of tools.getLegalMoves(state)) {
    const next = tools.applyMove(state, move);
    const score = next.winner === rootPlayer ? 20000 : minimax(next, depth - 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) bestMoves.push(move);
  }
  return bestMoves[Math.floor(rng() * bestMoves.length)];
};

export const chooseMediumMove = (state, tools, rng = Math.random) => {
  let selected = tools.getLegalMoves(state)[0];
  const deadline = Date.now() + 180;
  for (let depth = 2; depth <= 10; depth += 1) {
    try {
      selected = findBestMove(state, tools, { depth, deadline, rng });
    } catch (error) {
      if (error.message !== "SEARCH_TIMEOUT") throw error;
      break;
    }
  }
  return selected;
};
