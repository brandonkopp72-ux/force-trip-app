import { HeroBanner } from "./HeroBanner.jsx";
import { StarfieldCrawl } from "./StarfieldCrawl.jsx";

const crawlTextStyle = {
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 700,
  color: "#f5cc4d",
  textAlign: "center",
  lineHeight: 1.6,
  margin: "0 0 22px",
};

export function IntroPage({ onAccept }) {
  return (
    <div className="page">
      <HeroBanner accent="#5b3a86" title="F.O.R.C.E." subtitle="Family Of Rebels Creating Experiences" />

      <StarfieldCrawl>
        <div style={{ ...crawlTextStyle, fontSize: 15, letterSpacing: "0.15em", marginBottom: 6 }}>EPISODE II</div>
        <div style={{ ...crawlTextStyle, fontSize: 22, marginBottom: 28 }}>FLORIDA STRIKES BACK</div>

        <p style={{ ...crawlTextStyle, fontSize: 14 }}>
          It has been three and a half years since the infamous Rebel coastal assault on battlefield Florida.
        </p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>
          Time has tested the survivors. Yet six remain — older, wiser, and forged by experience.
        </p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>They call themselves F.O.R.C.E.</p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>Family Of Rebels Creating Experiences.</p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>
          Now, a new objective looms on the horizon: Central Florida — birthplace of Florida Man, home to mythical
          lands, towering coasters, dark magic, and creatures perhaps best left untold.
        </p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>
          F.O.R.C.E. will rendezvous at MCO and establish basecamp at Dockside before launching their first strike
          against the fortress known as Hollywood Studios — where legends are made, empires rise, and lightsabers
          are sold to anyone brave enough to spend the credits.
        </p>
        <p style={{ ...crawlTextStyle, fontSize: 14 }}>
          Downloaded and opened, the archives must be. Know what awaits them, they do not. Hidden, the path forward
          lies. Choose, they must.
        </p>
      </StarfieldCrawl>

      {onAccept && (
        <button
          onClick={onAccept}
          style={{
            display: "block",
            width: "100%",
            marginTop: 4,
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
