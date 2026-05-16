import { ImageResponse } from "next/og";
import { loadDancingScript } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const dancingScript = await loadDancingScript();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff2d92 0%, #ff6b47 100%)",
          color: "white",
          fontFamily: "DancingScript",
          fontWeight: 700,
          fontSize: 150,
          paddingBottom: 10,
        }}
      >
        A
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
