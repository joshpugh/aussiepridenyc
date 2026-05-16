import { ImageResponse } from "next/og";
import { loadDancingScript } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 56,
          // Optical centering — Dancing Script "A" hangs low.
          paddingBottom: 4,
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
