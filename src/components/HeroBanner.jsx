// A shared "night sky fading into the zone's accent color" hero banner,
// used at the top of every tab so the whole app shares one visual language
// while each tab still feels distinct through its own accent color.
//
// glowColor/pulse let a specific zone (currently just HHN) reskin the glow
// orb into a slowly breathing red "moon" without touching any other zone —
// the orb is a plain styled div, not a raster image, so this is a safe,
// fully responsive change (no fixed-pixel overlay to break on resize).
export function HeroBanner({ accent, title, subtitle, glowColor = "#ffe7ad", pulse = false }) {
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
      {pulse && (
        <style>{`
          @keyframes hbMoonPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes hbHaloPulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.42; transform: scale(1.3); }
          }
          .hb-moon-core { animation: hbMoonPulse 3.2s ease-in-out infinite; }
          .hb-moon-halo { animation: hbHaloPulse 3.2s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .hb-moon-core, .hb-moon-halo { animation: none; opacity: 0.85; }
          }
        `}</style>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(rgba(255,255,255,0.05) 0px, transparent 1px, transparent 3px)",
          pointerEvents: "none",
        }}
      />

      {/* Outer halo — bleeds slightly into the surrounding sky */}
      <div
        className={pulse ? "hb-moon-halo" : undefined}
        style={{
          position: "absolute",
          top: 4,
          right: 14,
          width: 66,
          height: 66,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}55 0%, transparent 70%)`,
          filter: "blur(1px)",
        }}
      />

      {/* Moon/glow core */}
      <div
        className={pulse ? "hb-moon-core" : undefined}
        style={{
          position: "absolute",
          top: 16,
          right: 22,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor}55 55%, transparent 75%)`,
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
