import React from "react";
import { Lightbulb } from "lucide-react";

const HintModeToggle = ({ enabled, onChange }) => (
  <div className="hint-controls">
    <label className="hint-toggle">
      <span className="hint-toggle-copy">
        <Lightbulb size={18} aria-hidden="true" />
        <span>
          <strong>Hint mode</strong>
          <small>Show the age of both players’ moves</small>
        </span>
      </span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-label="Hint mode"
      />
      <span className="hint-switch" aria-hidden="true" />
    </label>

    {enabled && (
      <div className="hint-legend" aria-label="Move age colors">
        <span><i className="hint-dot hint-dot-latest" />Last</span>
        <span><i className="hint-dot hint-dot-second" />2nd last</span>
        <span><i className="hint-dot hint-dot-third" />3rd last · fades next</span>
      </div>
    )}
  </div>
);

export default HintModeToggle;
