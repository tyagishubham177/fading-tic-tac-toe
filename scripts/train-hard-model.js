#!/usr/bin/env node

/* Deterministic, dependency-free self-play trainer for the browser's linear value model. */
const fs = require("fs");
const path = require("path");

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const EPISODES = Number(process.env.TRAINING_EPISODES || 60000);
let seed = Number(process.env.TRAINING_SEED || 20260929) >>> 0;
const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
const other = (player) => player === "X" ? "O" : "X";
const initial = () => ({ board: Array(9).fill(null), currentPlayer: "X", turn: 1 });
const legal = (state) => state.board.flatMap((cell, index) => cell ? [] : [index]);
const winner = (board) => {
  for (const [a,b,c] of LINES) if (board[a] && board[a].player === board[b]?.player && board[a].player === board[c]?.player) return board[a].player;
  return null;
};
const move = (state, index) => {
  const board = [...state.board];
  board[index] = { player: state.currentPlayer, turn: state.turn };
  const marks = board.map((cell, i) => ({ cell, i })).filter(({cell}) => cell?.player === state.currentPlayer).sort((a,b) => a.cell.turn - b.cell.turn);
  if (marks.length > 3) board[marks[0].i] = null;
  return { board, currentPlayer: other(state.currentPlayer), turn: state.turn + 1 };
};
const features = (state, player) => {
  const result = [1,0,0,0,0,0,0,0,0,0,0,0];
  for (const line of LINES) {
    const cells = line.map((i) => state.board[i]?.player);
    const own = cells.filter((v) => v === player).length;
    const opp = cells.filter((v) => v === other(player)).length;
    if (!opp) result[own === 2 ? 1 : own === 1 ? 2 : 3]++;
    if (!own) result[opp === 2 ? 4 : opp === 1 ? 5 : 6]++;
  }
  result[7] = state.board[4]?.player === player ? 1 : 0;
  result[8] = state.board[4]?.player === other(player) ? 1 : 0;
  result[9] = [0,2,6,8].filter((i) => state.board[i]?.player === player).length;
  result[10] = [0,2,6,8].filter((i) => state.board[i]?.player === other(player)).length;
  result[11] = state.currentPlayer === player ? 1 : -1;
  return result;
};
const dot = (a,b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const weights = Array(12).fill(0);
let wins = 0;
let draws = 0;

for (let episode = 0; episode < EPISODES; episode++) {
  let state = initial();
  const history = [];
  let result = null;
  for (let ply = 0; ply < 100 && !result; ply++) {
    const player = state.currentPlayer;
    const choices = legal(state).map((index) => ({ index, state: move(state, index) }));
    const epsilon = 0.35 - 0.30 * (episode / EPISODES);
    let choice;
    if (random() < epsilon) choice = choices[Math.floor(random() * choices.length)];
    else {
      const scored = choices.map((item) => ({ ...item, score: dot(features(item.state, player), weights) + random() * 1e-6 }));
      choice = scored.reduce((best, item) => item.score > best.score ? item : best);
    }
    history.push({ player, features: features(choice.state, player) });
    state = choice.state;
    result = winner(state.board);
  }
  if (result) wins++; else draws++;
  const rate = 0.015 * (1 - 0.7 * episode / EPISODES);
  for (const sample of history) {
    const target = result ? (sample.player === result ? 1 : -1) : 0;
    const prediction = Math.tanh(dot(sample.features, weights));
    const error = target - prediction;
    sample.features.forEach((value, index) => { weights[index] += rate * error * value; });
  }
}

const artifact = {
  format: "fading-ttt-linear-value-v1",
  algorithm: "epsilon-greedy Monte Carlo self-play",
  episodes: EPISODES,
  seed: Number(process.env.TRAINING_SEED || 20260929),
  generatedAt: "2026-09-29T00:00:00.000Z",
  featureCount: weights.length,
  trainingResults: { decisiveGames: wins, cappedDraws: draws },
  weights: weights.map((value) => Number(value.toFixed(8))),
};
const output = path.join(__dirname, "../src/bots/trained/hard-model.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`Wrote ${output} after ${EPISODES} self-play games.`);
