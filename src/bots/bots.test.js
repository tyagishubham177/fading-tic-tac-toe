import { chooseEasyMove } from "./easyBot";
import { chooseMediumMove } from "./search";
import { chooseHardMove, HARD_MODEL_METADATA } from "./hardBot";
import { applyMove, createInitialState, getLegalMoves, getPositionKey } from "../game/engine";

const tools = { applyMove, getLegalMoves, getPositionKey };

test.each([
  ["easy", chooseEasyMove],
  ["medium", chooseMediumMove],
  ["hard", chooseHardMove],
])("%s bot returns a legal opening move", (_name, chooser) => {
  const state = createInitialState();
  expect(getLegalMoves(state)).toContain(chooser(state, { ...tools, rng: () => 0.25 }));
});

test("all difficulties take an immediate win", () => {
  let state = createInitialState();
  [0, 3, 1, 4].forEach((move) => { state = applyMove(state, move); });
  expect(chooseEasyMove(state, { ...tools, rng: () => 0 })).toBe(2);
  expect(chooseMediumMove(state, tools, () => 0)).toBe(2);
  expect(chooseHardMove(state, tools, () => 0)).toBe(2);
});

test("hard mode loads a reproducible self-play artifact", () => {
  expect(HARD_MODEL_METADATA.algorithm).toMatch(/self-play/i);
  expect(HARD_MODEL_METADATA.episodes).toBeGreaterThanOrEqual(60000);
  expect(HARD_MODEL_METADATA.weights).toHaveLength(HARD_MODEL_METADATA.featureCount);
});
