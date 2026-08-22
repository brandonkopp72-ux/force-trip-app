import { HeroBanner } from "./HeroBanner.jsx";
import { PARKS } from "../data/parks.js";
import { YOUTUBE_CHANNELS } from "../data/resources.js";
import { FLIGHT_ITINERARIES } from "../data/flights.js";

function FlightLeg({ leg, label }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#8a8272",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 4,
        }}
      >
        {label} — {leg.date}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{leg.from.code}</div>
          <div style={{ fontSize: 11, color: "#8a8272" }}>{leg.from.city}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{leg.from.time}</div>
        </div>
        <div style={{ color: "#8a8272", fontSize: 18, flexShrink: 0 }}>✈️</div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{leg.to.code}</div>
          <div style={{ fontSize: 11, color: "#8a8272" }}>{leg.to.city}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{leg.to.time}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#8a8272", marginTop: 4 }}>
        {leg.flight} · {leg.duration}
        {leg.seat ? ` · Seat ${leg.seat}` : ""}
      </div>
    </div>
  );
}

function FlightCard({ itinerary }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14 }}>{itinerary.label}</div>
        <div style={{ fontSize: 11.5, color: "#8a8272" }}>{itinerary.route}</div>
      </div>
      <div style={{ fontSize: 11.5, color: "#8a8272", marginBottom: 10 }}>{itinerary.travelers.join(", ")}</div>

      <FlightLeg leg={itinerary.outbound} label="Outbound" />
      <div style={{ borderTop: "1px dashed #e6e0d0", margin: "10px 0" }} />
      <FlightLeg leg={itinerary.returnFlight} label="Return" />

      <div style={{ marginTop: 10, fontSize: 11, color: "#8a8272" }}>
        Confirmation: <strong style={{ color: "#2c2a24" }}>{itinerary.confirmation}</strong>
      </div>
    </div>
  );
}

export function ResourcesPage({ onAdvance, advanceLabel = "Review Mission Objectives →" }) {
  const officialLinks = PARKS.filter((p) => p.learnMoreUrl);

  return (
    <div className="page">
      <HeroBanner accent="#2f5d42" title="Mission Resources" subtitle="Scope out the objective theater before you vote" />

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>
          Official Park & Event Pages
        </div>
        {officialLinks.map((p) => (
          <a
            key={p.id}
            href={p.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: p.accent, marginBottom: 8, textDecoration: "none" }}
          >
            {p.learnMoreLabel || p.park} ↗
          </a>
        ))}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>
          YouTube Walkthrough Channels
        </div>
        {YOUTUBE_CHANNELS.map((c) => (
          <a
            key={c.url}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginBottom: 10, textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name} ↗</div>
            <div style={{ fontSize: 12, color: "#6b6455" }}>{c.note}</div>
          </a>
        ))}
      </div>

      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, margin: "20px 0 10px" }}>
        Transport Intelligence
      </div>

      {FLIGHT_ITINERARIES.map((itinerary) => (
        <FlightCard key={itinerary.id} itinerary={itinerary} />
      ))}

      <div className="card" style={{ background: "#f3ecd8", borderColor: "#d8c088" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
          🛬 Rendezvous Intel
        </div>
        <div style={{ fontSize: 12.5, color: "#5c4a2a" }}>
          Main Squad arrives MCO at 8:30 AM. Justin arrives at 8:40 AM — about 10 minutes apart.
        </div>
      </div>

      {onAdvance && (
        <button className="advance-btn" style={{ background: "#2f5d42" }} onClick={onAdvance}>
          {advanceLabel}
        </button>
      )}
    </div>
  );
}
