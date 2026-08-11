// A shared "night sky fading into the zone's accent color" hero banner,
// used at the top of every tab so the whole app shares one visual language
// while each tab still feels distinct through its own accent color.
export function HeroBanner({ accent, title, subtitle }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        height: 120,
        marginBottom: 14,
        background: `linear-gradient(180deg, #1f1440 0%, ${accent} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(rgba(255,255,255,0.05) 0px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 22,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffe7ad 0%, rgba(255,231,173,0.15) 70%, transparent 100%)",
        }}
      />
      <svg
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 42 }}
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 L60 15 L110 35 L170 10 L230 32 L290 12 L340 30 L400 18 L400 60 L0 60 Z"
          fill="rgba(10,6,20,0.55)"
        />
      </svg>
      <div style={{ position: "absolute", bottom: 10, left: 14, right: 14 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#fbe9d0",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 11.5, color: "#f3ddb8", opacity: 0.9 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
