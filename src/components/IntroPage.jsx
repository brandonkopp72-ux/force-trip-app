export function IntroPage() {
  return (
    <div className="page">
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5b3a86", fontWeight: 600 }}>
        Transmission incoming...
      </div>

      <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, margin: "6px 0 12px" }}>
        Your Orders, Rebels.
      </h1>

      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", marginBottom: 20 }}>
        The Outpost is secured. The transports are booked. All that's left is deciding who storms which sector of
        the galaxy — and when.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
        {[
          "Review the Mission Resources tab to scope out the objective theater.",
          "Tap ⭐, ❤️, or 🚫 on anything you want to weigh in on — it lights up when you're in.",
          "Check My Profile any time to see your own stats and squad matches.",
          "Check the Mission Debrief and Planner tabs to see how things are shaping up for everyone.",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: "#fff",
                background: "#5b3a86",
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 12.5,
          fontStyle: "italic",
          color: "#8a6d1f",
          background: "#f3ecd8",
          borderRadius: 10,
          padding: "12px 14px",
          lineHeight: 1.5,
        }}
      >
        This isn't a squad that has to move as one unit the whole trip — split up, chase what excites you, and
        skip what doesn't. This is here to figure out who wants what, not to force everyone into the same lines.
        Let's still fly this thing with a plan — map the mission, live the mission.
      </div>
    </div>
  );
}
