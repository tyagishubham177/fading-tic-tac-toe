import { WINNING_COMBINATIONS } from "../components/constants";

export const extractModelFeatures = (state, player) => {
  const opponent = player === "X" ? "O" : "X";
  const features = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const combo of WINNING_COMBINATIONS) {
    const cells = combo.map((index) => state.board[index]?.player);
    const own = cells.filter((value) => value === player).length;
    const other = cells.filter((value) => value === opponent).length;
    if (!other) features[own === 2 ? 1 : own === 1 ? 2 : 3] += 1;
    if (!own) features[other === 2 ? 4 : other === 1 ? 5 : 6] += 1;
  }

  features[7] = state.board[4]?.player === player ? 1 : 0;
  features[8] = state.board[4]?.player === opponent ? 1 : 0;
  features[9] = [0, 2, 6, 8].filter((index) => state.board[index]?.player === player).length;
  features[10] = [0, 2, 6, 8].filter((index) => state.board[index]?.player === opponent).length;
  features[11] = state.currentPlayer === player ? 1 : -1;
  return features;
};

export const evaluateWithModel = (state, player, model) =>
  extractModelFeatures(state, player).reduce(
    (value, feature, index) => value + feature * model.weights[index],
    0
  );
