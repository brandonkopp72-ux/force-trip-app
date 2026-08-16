import { HeroBanner } from "./HeroBanner.jsx";

export function IntroPage({ onAccept }) {
  return (
    <div className="page">
      <HeroBanner accent="#5b3a86" title="F.O.R.C.E." subtitle="Family Of Rebels Creating Experiences" />

      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#5b3a86",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        Episode II
      </div>

      <h1
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.02em",
          margin: "0 0 16px",
        }}
      >
        Florida Strikes Back
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          It has been three and a half years since the infamous Rebel coastal assault on battlefield Florida.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          Time has tested the survivors. Yet six remain — older, wiser, and forged by experience.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          They call themselves F.O.R.C.E.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          Family Of Rebels Creating Experiences.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          Now, a new objective looms on the horizon: Central Florida — birthplace of Florida Man, home to mythical
          lands, towering coasters, dark magic, and creatures perhaps best left untold.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          F.O.R.C.E. will rendezvous at MCO and establish basecamp at Dockside before launching their first strike
          against the fortress known as Hollywood Studios — where legends are made, empires rise, and lightsabers
          are sold to anyone brave enough to spend the credits.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4a4536", fontStyle: "italic", margin: 0 }}>
          Downloaded and opened, the archives must be. Know what awaits them, they do not. Hidden, the path forward
          lies. Choose, they must.
        </p>
      </div>

      {onAccept && (
        <button
          onClick={onAccept}
          style={{
            display: "block",
            width: "100%",
            marginTop: 20,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            lineHeight: 1.5,
            color: "#fff",
            background: "#5b3a86",
            border: "none",
            borderRadius: 12,
            padding: "20px 16px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(91, 58, 134, 0.4)",
          }}
        >
          Plan the Mission, They Must.
          <br />
          Run the Mission, They Will.
        </button>
      )}
    </div>
  );
}
