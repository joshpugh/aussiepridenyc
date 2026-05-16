import { ImageResponse } from "next/og";
import { loadDancingScript } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const alt = "Aussie Pride NYC 2026 — March with Australia at NYC Pride";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const dancingScript = await loadDancingScript();

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
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            opacity: 0.95,
            fontWeight: 600,
          }}
        >
          SUNDAY 28 JUNE 2026
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 130,
              fontFamily: "DancingScript",
              lineHeight: 1,
              fontWeight: 700,
              display: "flex",
              flexDirection: "column",
              marginLeft: -6,
            }}
          >
            <div style={{ display: "flex" }}>March with Australia</div>
            <div style={{ display: "flex" }}>at NYC Pride</div>
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 24,
              display: "flex",
              opacity: 0.95,
            }}
          >
            🦘 🐨 🏄 ☀️ 🏳️‍🌈 ✨
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", opacity: 0.9 }}>aussiepridenyc.com</div>
          <div style={{ display: "flex", opacity: 0.9 }}>
            America Josh · Consulate-General · AAA
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "DancingScript",
          data: dancingScript,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
