import { useState } from "react";
import { FAMILY } from "../data/family.js";

export function IdentityGate({ onLogin, loginError }) {
  const [selected, setSelected] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (pinInput.length !== 4) return;
    setSubmitting(true);
    await onLogin(selected, pinInput);
    setSubmitting(false);
    setPinInput("");
  };

  if (!selected) {
    return (
      <div className="identity-gate">
        <div className="eyebrow">F.O.R.C.E. — Family Of Rebels Creating Experiences</div>
        <h1 className="identity-title">Who's on mission?</h1>
        <p style={{ color: "#6b6455", fontSize: 14 }}>Choose your name to begin.</p>
        <div className="name-grid">
          {FAMILY.map((name) => (
            <button key={name} className="name-btn" onClick={() => setSelected(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="identity-gate">
      <div className="eyebrow">F.O.R.C.E.</div>
      <h1 className="identity-title">Enter {selected}'s PIN</h1>
      <p style={{ color: "#6b6455", fontSize: 13.5 }}>
        Ask Brandon if you don't know it. This just keeps everyone's own selections safe from accidental edits.
      </p>
      <input
        className="pin-input"
        type="tel"
        inputMode="numeric"
        maxLength={4}
        autoFocus
        value={pinInput}
        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="••••"
      />
      {loginError && <div className="error-text">{loginError}</div>}
      <button className="primary-btn" onClick={handleSubmit} disabled={submitting || pinInput.length !== 4}>
        {submitting ? "Checking…" : "Enter FORCE"}
      </button>
      <button
        className="switch-link"
        style={{ display: "block", margin: "14px auto 0" }}
        onClick={() => {
          setSelected(null);
          setPinInput("");
        }}
      >
        ← Not {selected}?
      </button>
    </div>
  );
}
