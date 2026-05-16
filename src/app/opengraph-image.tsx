import { ImageResponse } from "next/og";
import { loadDancingScript, loadFraunces } from "@/lib/og-fonts";
import { loadWhiteLogo } from "@/lib/og-logos";

export const runtime = "nodejs";
export const alt = "Aussie Pride NYC 2026 — March with Australia at NYC Pride";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const [dancingScript, fraunces, americaJosh, consulate, aaa] =
    await Promise.all([
      loadDancingScript(),
      loadFraunces(),
      loadWhiteLogo("america-josh", 50),
      loadWhiteLogo("consulate", 64),
      loadWhiteLogo("aaa", 56),
    ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(ellipse at 20% 20%, #ff7eb3 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, #ffb37e 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, #ff5e7a 0%, transparent 60%), linear-gradient(135deg, #ff2d92 0%, #ff6b47 100%)",
          color: "white",
          fontFamily: "Fraunces, serif",
        }}
      >
        {/* Top: date */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            fontFamily: "Fraunces, serif",
            fontWeight: 600,
            opacity: 0.95,
            textTransform: "uppercase",
          }}
        >
          Sunday 28 June 2026
        </div>

        {/* Middle: Dancing Script headline */}
        <div
          style={{
            fontSize: 92,
            fontFamily: "DancingScript",
            fontWeight: 700,
            lineHeight: 1.05,
            display: "flex",
            flexDirection: "column",
            marginLeft: -4,
          }}
        >
          <div style={{ display: "flex" }}>March with Australia</div>
          <div style={{ display: "flex" }}>at NYC Pride</div>
        </div>

        {/* Bottom: URL left, white logos right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              letterSpacing: 1,
              opacity: 0.95,
            }}
          >
            aussiepridenyc.com
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 36,
            }}
          >
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={americaJosh.src}
              alt=""
              width={americaJosh.width}
              height={americaJosh.height}
              style={{ opacity: 0.95 }}
            />
            <img
              src={consulate.src}
              alt=""
              width={consulate.width}
              height={consulate.height}
              style={{ opacity: 0.95 }}
            />
            <img
              src={aaa.src}
              alt=""
              width={aaa.width}
              height={aaa.height}
              style={{ opacity: 0.95 }}
            />
            {/* eslint-enable @next/next/no-img-element */}
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
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
