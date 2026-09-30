import hardModel from "./trained/hard-model.json";
import { evaluateWithModel } from "./modelFeatures";
import { findBestMove, tacticalScore } from "./search";

export const chooseHardMove = (state, tools, rng = Math.random) => {
  const evaluate = (position, player) =>
    tacticalScore(position, player) + evaluateWithModel(position, player, hardModel) * 12;
  let selected = tools.getLegalMoves(state)[0];
  const deadline = Date.now() + 550;

  for (let depth = 4; depth <= 14; depth += 1) {
    try {
      selected = findBestMove(state, tools, { depth, deadline, evaluate, rng });
    } catch (error) {
      if (error.message !== "SEARCH_TIMEOUT") throw error;
      break;
    }
  }
  return selected;
};

export const HARD_MODEL_METADATA = hardModel;
