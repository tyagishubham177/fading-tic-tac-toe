import React, { useState } from "react";
import { Bot, Brain, Sparkles } from "lucide-react";

const difficulties = [
  { id: "easy", name: "Easy", detail: "Friendly, fast, and intentionally imperfect.", icon: Sparkles },
  { id: "medium", name: "Medium", detail: "Looks ahead with alpha-beta search.", icon: Brain },
  { id: "hard", name: "Hard", detail: "Self-play trained model plus deep search.", icon: Bot },
];

const BotSetup = ({ defaultUsername, onStart, onBack }) => {
  const [username, setUsername] = useState(defaultUsername || "Player");
  const [difficulty, setDifficulty] = useState("easy");
  const [humanMark, setHumanMark] = useState("X");

  return (
    <section className="bot-panel" aria-labelledby="bot-setup-heading">
      <button className="text-button" onClick={onBack}>← Back to modes</button>
      <p className="eyebrow">Solo arena</p>
      <h2 id="bot-setup-heading">Choose your challenger</h2>
      <p className="panel-copy">No room code or second device needed. Everything runs in this browser.</p>

      <label className="field-label" htmlFor="bot-player-name">Your name</label>
      <input
        id="bot-player-name"
        className="bot-input"
        value={username}
        maxLength={24}
        onChange={(event) => setUsername(event.target.value)}
      />

      <div className="difficulty-grid" aria-label="Bot difficulty">
        {difficulties.map(({ id, name, detail, icon: Icon }) => (
          <button
            key={id}
            className={`difficulty-card ${difficulty === id ? "selected" : ""}`}
            onClick={() => setDifficulty(id)}
            aria-pressed={difficulty === id}
          >
            <Icon size={25} />
            <strong>{name}</strong>
            <span>{detail}</span>
          </button>
        ))}
      </div>

      <fieldset className="mark-picker">
        <legend>Your mark</legend>
        {["X", "O"].map((mark) => (
          <button key={mark} className={humanMark === mark ? "selected" : ""} onClick={() => setHumanMark(mark)}>
            {mark} {mark === "X" ? "— move first" : "— bot moves first"}
          </button>
        ))}
      </fieldset>

      <button
        className="primary-action"
        disabled={!username.trim()}
        onClick={() => onStart({ username: username.trim(), difficulty, humanMark })}
      >
        Start match
      </button>
    </section>
  );
};

export default BotSetup;
