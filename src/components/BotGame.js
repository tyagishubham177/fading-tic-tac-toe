import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bot, RotateCcw } from "lucide-react";
import GameBoard from "./GameBoard";
import HintModeToggle from "./HintModeToggle";
import { applyMove, createInitialState, getHighlightCell, getLegalMoves, getPositionKey } from "../game/engine";
import { chooseEasyMove } from "../bots/easyBot";
import { chooseMediumMove } from "../bots/search";
import { chooseHardMove, HARD_MODEL_METADATA } from "../bots/hardBot";

const botTools = { applyMove, getLegalMoves, getPositionKey };
const labels = { easy: "Easy Bot", medium: "Medium Bot", hard: "Hard Bot" };

const BotGame = ({ username, difficulty, humanMark, onExit }) => {
  const botMark = humanMark === "X" ? "O" : "X";
  const [state, setState] = useState(() => createInitialState());
  const [isThinking, setIsThinking] = useState(false);
  const [scores, setScores] = useState({ human: 0, bot: 0, draws: 0 });
  const [hintMode, setHintMode] = useState(false);
  const scoredTurn = useRef(null);
  const botName = labels[difficulty];

  useEffect(() => {
    if (!state.gameOver || scoredTurn.current === state.turnCount) return;
    scoredTurn.current = state.turnCount;
    setScores((current) => ({
      ...current,
      human: current.human + (state.winner === humanMark ? 1 : 0),
      bot: current.bot + (state.winner === botMark ? 1 : 0),
      draws: current.draws + (!state.winner ? 1 : 0),
    }));
  }, [botMark, humanMark, state.gameOver, state.turnCount, state.winner]);

  const playMove = useCallback((move) => {
    setState((current) => {
      if (current.gameOver || !getLegalMoves(current).includes(move)) return current;
      return applyMove(current, move);
    });
  }, []);

  useEffect(() => {
    if (state.gameOver || state.currentPlayer !== botMark) return undefined;
    setIsThinking(true);
    const timer = setTimeout(() => {
      const chooser = difficulty === "easy" ? chooseEasyMove : difficulty === "medium" ? chooseMediumMove : chooseHardMove;
      const move = chooser(state, botTools);
      playMove(move);
      setIsThinking(false);
    }, difficulty === "easy" ? 450 : 220);
    return () => clearTimeout(timer);
  }, [botMark, difficulty, playMove, state]);

  const status = useMemo(() => {
    if (state.winner === humanMark) return `${username} wins!`;
    if (state.winner === botMark) return `${botName} wins.`;
    if (state.gameOver) return state.drawReason === "repetition" ? "Draw by repetition." : "Draw by move limit.";
    if (isThinking || state.currentPlayer === botMark) return `${botName} is thinking…`;
    return "Your move.";
  }, [botMark, botName, humanMark, isThinking, state, username]);

  const reset = () => {
    setIsThinking(false);
    scoredTurn.current = null;
    setState(createInitialState());
  };

  return (
    <main className="bot-game-shell">
      <header className="bot-game-header">
        <button className="text-button" onClick={onExit}><ArrowLeft size={17} /> Modes</button>
        <div className="difficulty-pill"><Bot size={16} /> {botName}</div>
      </header>

      <section className="score-strip" aria-label="Score">
        <div><span>{username} · {humanMark}</span><strong>{scores.human}</strong></div>
        <div><span>Draws</span><strong>{scores.draws}</strong></div>
        <div><span>{botName} · {botMark}</span><strong>{scores.bot}</strong></div>
      </section>

      <section className="bot-board-card">
        <p className="turn-number">Turn {state.turnCount}</p>
        <div className="bot-status-slot">
          <h2 aria-live="polite" aria-atomic="true">{status}</h2>
        </div>
        <HintModeToggle enabled={hintMode} onChange={setHintMode} />
        <GameBoard
          board={state.board}
          handleMove={playMove}
          highlightCell={getHighlightCell(state)}
          disabled={isThinking || state.currentPlayer !== humanMark || state.gameOver}
          hintMode={hintMode}
        />
        <button className="secondary-action" onClick={reset}><RotateCcw size={18} /> {state.gameOver ? "Rematch" : "Restart"}</button>
        {difficulty === "hard" && (
          <p className="model-note">Self-play model · {HARD_MODEL_METADATA.episodes.toLocaleString()} training games</p>
        )}
      </section>
    </main>
  );
};

export default BotGame;
