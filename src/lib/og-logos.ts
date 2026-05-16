import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Read a pre-rasterized white-logo PNG from /public/partners/white/ and
 * return a base64 data URL ready to drop into a Satori `<img>`.
 *
 * The PNGs are produced by `node scripts/build-white-logos.mjs` — re-run that
 * script whenever a source SVG in /public/partners changes.
 */
type LogoName = "america-josh" | "consulate" | "aaa";

export type WhiteLogo = {
  src: string;
  width: number;
  height: number;
};

const cache = new Map<LogoName, WhiteLogo>();

export async function loadWhiteLogo(
  name: LogoName,
  displayHeight: number,
): Promise<WhiteLogo> {
  const cacheKey = `${name}@${displayHeight}` as LogoName;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const file = await readFile(
    path.join(process.cwd(), "public/partners/white", `${name}.png`),
  );
  const { width: pngW, height: pngH } = readPngDimensions(file);
  const aspect = pngW / pngH;
  const result: WhiteLogo = {
    src: `data:image/png;base64,${file.toString("base64")}`,
    height: displayHeight,
    width: Math.round(displayHeight * aspect),
  };
  cache.set(cacheKey, result);
  return result;
}

function readPngDimensions(buf: Buffer): { width: number; height: number } {
  // PNG IHDR is at byte offset 16 (width) and 20 (height), big-endian uint32.
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}
