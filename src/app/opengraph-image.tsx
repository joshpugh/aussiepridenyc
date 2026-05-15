import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aussie Pride NYC 2026 — March with us at NYC Pride";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(ellipse at 20% 20%, #ff7eb3 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, #ffb37e 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, #ff5e7a 0%, transparent 60%), linear-gradient(135deg, #ff2d92 0%, #ff6b47 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, opacity: 0.95 }}>
          SUNDAY 28 JUNE 2026
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>March with us</div>
            <div style={{ display: "flex" }}>at NYC Pride.</div>
          </div>
          <div style={{ fontSize: 36, marginTop: 24, display: "flex", opacity: 0.95 }}>
            🦘 🐨 🏄 🪃 ☀️ 🏳️‍🌈
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", opacity: 0.85 }}>aussiepridenyc.com</div>
          </div>
          <div style={{ display: "flex", opacity: 0.85 }}>
            America Josh · Consulate-General · AAA
          </div>
        </div>
      </div>
    ),
    size,
  );
}
