# Three bot modes: implementation and hosted-test plan

## Goal

Add a **Play vs bot** path without changing the existing online two-player path. The
player can choose Easy, Medium, or Hard before a game and can play as either mark.
Bot turns should feel immediate, remain legal under the fading rule, and never need
the player to install or run anything locally.

The first implementation now lives alongside this plan: it includes all three bot
modes, an offline self-play trainer, and a committed browser model. The remaining
delivery recommendations describe how to harden, benchmark, and host that feature
before merging it to the default branch.

## Important rules to settle first

The current rules keep at most three marks per player, so after fading begins the
board may never fill. A bot search or self-play episode can therefore enter a cycle.
Before building a solver, make these rules explicit and use them everywhere:

1. A mark is placed with the current turn number.
2. When a player places a fourth mark, that player's oldest mark is removed.
3. Win detection happens after the fade is applied, matching current gameplay.
4. A repeated position is a draw after the same complete state occurs three times.
5. A game is also a draw after 100 plies as a defensive upper bound.

A complete position includes the occupant and relative age of every mark, the side
to move, and the repetition count. It is not enough to encode only `X`, `O`, and
empty cells because mark order determines which mark fades next.

## Target architecture

### 1. One authoritative, pure rules engine

Create `src/game/engine.js` and make UI play, all bots, tests, and the training
environment call it. Its public API should be small:

```js
getLegalMoves(state) -> number[]
applyMove(state, cell) -> state
getOutcome(state) -> "X" | "O" | "draw" | null
getStateKey(state) -> string
```

Move fading, win checking, turn advancement, repetition tracking, and the move cap
behind `applyMove`. Keep functions immutable and deterministic. Adapt `useGame` to
use the engine instead of reconstructing these transitions in the hook. This avoids
training an excellent bot against rules that differ subtly from production.

### 2. Bot boundary

Create a difficulty-independent contract:

```js
chooseMove(state, { signal, timeBudgetMs, rng }) -> Promise<number>
```

Put implementations under `src/bots/`, selected by a bot registry. Every
implementation receives only a state and returns a legal cell. Seedable `rng`
makes tests reproducible; `AbortSignal` prevents an outdated calculation from
moving after reset or navigation.

Run Medium and Hard calculations in a Web Worker so search/model evaluation cannot
freeze the interface. The game controller should wait a short, configurable delay,
show “Bot is thinking…”, reject human clicks during the bot turn, and validate the
returned move again before applying it.

### 3. Separate local bot games from Firebase rooms

Keep bot games in React state (optionally persisted to `localStorage`) rather than
creating a fake Firebase participant. Existing multiplayer rooms continue to sync
through Firestore. A shared controller should expose the same view model to `Game`
for either storage adapter:

- `useMultiplayerGame(roomId, player)` for current Firestore play.
- `useBotGame({ difficulty, humanMark })` for local bot play.

This makes bot play available on the deployed site without a second device,
credentials beyond the site's existing configuration, or a running training
server. It also avoids unnecessary Firestore writes and prevents a client bot from
racing snapshot updates.

## Difficulty designs

### Easy: rules plus deliberate mistakes

Easy should be predictable enough to understand but beatable by a new player. On
each turn:

1. Take an immediate win when one exists (about 70% of the time).
2. Block an immediate human win (about 55% of the time).
3. Otherwise choose a weighted random legal move, preferring center, then corners.
4. Add a 250–550 ms presentation delay; this is not computation time.

The percentages belong in named configuration, not scattered magic numbers. Tests
use a seeded generator and also run many seeds to ensure every returned move is
legal. Easy should not call search code or download the Hard model.

### Medium: bounded adversarial search

Implement iterative-deepening negamax/minimax with alpha-beta pruning:

- Search until a 150–250 ms budget expires, retaining the last fully completed
  depth (start with a depth of 6 plies).
- Use a transposition table keyed by a symmetry-canonical state key, side to move,
  and remaining depth.
- Treat repetitions and the 100-ply limit as draws.
- Order immediate wins and blocks first, then transposition-table moves, center,
  corners, and edges.
- Score terminal states above all heuristics, with quicker wins and slower losses
  preferred.
- Evaluate non-terminal leaves using open lines, forks, immediate threats, center
  control, and whether a useful mark is next to fade.
- Break equally scored moves with seeded randomness so games do not feel identical.

Benchmark on representative early and cycling states in a production build. The
95th percentile should remain within 300 ms on a mid-range mobile device.

### Hard: self-play-trained policy/value bot

Use an AlphaZero-style offline pipeline: Monte Carlo Tree Search (MCTS) generates
self-play targets, and a small neural network learns both move policy and position
value. “Hard” must be strong because of measured results, not its label.

#### State and model

- Encode `X` marks, `O` marks, mark age/order planes, side to move, repetition
  information, and normalized ply count.
- Mask illegal actions before policy normalization.
- Exploit all eight board rotations/reflections as training augmentation.
- Start with a small residual network sized for a 3×3 board; export it to ONNX or
  TensorFlow.js and quantize only if strength is unchanged.
- Load the model lazily only when Hard is selected. Publish a version and SHA-256
  checksum beside the artifact so a cached incompatible model is never used.

#### Training loop

Add a versioned Python package under `training/` that imports or mirrors a tested
rules specification, with deterministic seeds and checkpoint resume:

1. Bootstrap self-play from random model weights using MCTS exploration.
2. Store `(state, visit-policy, outcome)` examples in a bounded replay buffer.
3. Train a candidate policy/value network on mixed recent and historical games.
4. Arena-test candidate versus champion with colors swapped.
5. Promote only when the candidate wins at least 55% over a statistically useful
   match set and does not regress on the tactical suite.
6. Repeat until the champion meets the release gates; retain metrics, config, seed,
   code revision, and artifact hash for reproducibility.

Training happens in CI or a managed GPU job, never in the player's browser. Browser
Hard mode uses the frozen exported model plus a modest MCTS search (for example,
search count tuned to a 400–800 ms UI budget) in a worker. If loading or inference
fails, show a non-blocking notice and fall back to Medium—never make a random or
illegal move.

#### Strength gates

The release candidate must be evaluated on held-out seeds with alternating first
player. Recommended minimum gates:

- At least 95% non-loss rate against Medium across 2,000 games.
- At least 80% win rate against Easy across 2,000 games.
- 100% correct on a curated suite of immediate wins, mandatory blocks, fade-created
  threats, and repetition saves.
- Zero illegal moves, crashes, or games beyond the configured move cap in 100,000
  randomized validation games.

If exhaustive state enumeration is tractable after canonicalization, also compare
Hard with a retrograde/oracle solver. That oracle is for evaluation and target
verification; the shipped Hard mode remains the requested self-play-trained agent.
Avoid marketing it as “unbeatable” until oracle testing proves the claim. In the
UI, describe it as “self-play trained” and publish the measured evaluation record.

## User experience

Extend the lobby with two clear choices: **Play online** and **Play vs bot**. Bot
setup contains difficulty cards, mark choice (`X`, `O`, or random), and a Start
button. Preserve the current username convenience but do not require a room ID.

During play:

- Display the bot name and difficulty in the scoreboard.
- Disable the board and announce status accessibly while the bot thinks.
- Let the human reset/rematch or return to mode selection.
- Keep scores and history for the browser session.
- Explain that Hard downloads an additional model and may take longer for its first
  move; show loading progress and a retry action.

## Testing strategy

### Unit and property tests

- Engine: legal moves, immutable transitions, exact fade order, wins after fading,
  repetition draws, move-cap draws, and symmetry-equivalent state keys.
- Easy: seeded decisions, tactical probabilities at their boundaries, and legality.
- Medium: forced win/block fixtures, cycle handling, stable time cancellation, and
  transposition-table correctness.
- Hard: encoder planes, legal-action mask, artifact metadata/checksum, deterministic
  inference fixture, worker cancellation, and Medium fallback.
- Property tests: thousands of random games in which counts never exceed three per
  player and bots never select occupied cells.

### Integration and end-to-end tests

- Select each difficulty and finish/reset/rematch a game as both `X` and `O`.
- Confirm multiplayer create/join remains unchanged.
- Confirm refresh/session behavior and no Firestore calls during bot-only games.
- Test keyboard play, focus, screen-reader status, narrow mobile layout, offline
  behavior after caching, slow model download, and a corrupt model response.
- Record bundle sizes and performance budgets in CI.

## Delivery phases

1. **Rules foundation:** extract the engine, define repetition/move-cap behavior,
   and add exhaustive rule tests without changing the UI.
2. **Playable MVP:** add local game storage, mode/difficulty UI, Easy, cancellation,
   accessibility status, and hosted preview.
3. **Search:** add the worker and Medium, then benchmark/tune it on mobile.
4. **Training foundation:** add environment parity tests, encoder, MCTS, reproducible
   training CLI, checkpoints, evaluation reports, and artifact export.
5. **Hard integration:** lazy inference, worker MCTS, fallback, model integrity and
   cache/version behavior.
6. **Strength and release:** run the full arena, tactical and randomized gates;
   conduct accessibility/regression testing; then promote the preview.

Each phase should be a reviewable pull request into `feature/bot-modes`. Do not mix
generated checkpoints or replay data into the application repository. Store only
the final web model and its compact evaluation/metadata files, or fetch versioned
artifacts from release storage during deployment.

## Independent branch and no-local-setup workflow

1. Branch from the latest default branch as `feature/bot-modes`; protect the default
   branch from direct pushes.
2. Configure the hosting provider to create a unique preview URL for every pull
   request into that branch. Keep the existing production Firebase project out of
   previews; use a preview project/configuration when multiplayer regression tests
   need Firestore.
3. Run lint, unit tests, production build, end-to-end smoke tests, bundle budgets,
   and bot legality simulations in CI on every push.
4. Run expensive training only from a manual, pinned workflow. Upload checkpoints
   and reports as artifacts; require evaluation gates before publishing a model.
5. Put the preview URL, tested model version, evaluation report, and known limits in
   the pull request. This lets stakeholders test from a browser without cloning the
   repository or running local commands.
6. Merge behind a `botModeEnabled` feature flag. First enable it only on the preview,
   then for a small production cohort, and finally for everyone after telemetry
   shows acceptable model-load errors, move latency, and game completion rates.

## Definition of done

- All three difficulties can complete legal games on the hosted preview on desktop
  and mobile, as either player, without local setup.
- Existing online multiplayer behavior and stored room data remain compatible.
- Medium meets its latency budget; Hard meets published arena and tactical gates.
- Hard's artifact is reproducible, integrity-checked, lazy-loaded, and has a tested
  fallback path.
- Keyboard and screen-reader flows pass, CI is green, and the preview includes an
  evaluation report rather than an unsupported “unbeatable” claim.
