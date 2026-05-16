#!/usr/bin/env node
/**
 * Reads each /public/partners/*.svg, whitens every fill/stroke, rasterizes to
 * a high-res PNG with a transparent background, and writes it to
 * /public/partners/white/*.png.
 *
 * Run with: node scripts/build-white-logos.mjs
 *
 * The output PNGs are committed and consumed by src/app/opengraph-image.tsx —
 * we generate at build time rather than at request time so the OG route has
 * no native-binding dependency at runtime (Turbopack can't bundle resvg).
 */
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const SRC_DIR = path.resolve("public/partners");
const OUT_DIR = path.resolve("public/partners/white");

// Render at a high target height so the OG image (which uses these at
// 56-72px) stays crisp on retina viewers.
const TARGET_HEIGHT_PX = 256;

function whitenSvg(svg) {
  let out = svg;
  out = out.replace(/<\?xml[^?]*\?>/g, "");
  out = out.replace(/<!DOCTYPE[^>]*>/g, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/<defs[\s\S]*?<\/defs>/gi, "");
  out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
  out = out.replace(/\sclass\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/fill\s*:\s*(?!none\b)[^;"}]+/gi, "fill: #ffffff");
  out = out.replace(/stroke\s*:\s*(?!none\b)[^;"}]+/gi, "stroke: #ffffff");
  out = out.replace(/\bfill\s*=\s*"(?!none)[^"]*"/gi, 'fill="#ffffff"');
  out = out.replace(/\bstroke\s*=\s*"(?!none)[^"]*"/gi, 'stroke="#ffffff"');
  out = out.replace(/<svg\b([^>]*)>/i, (_m, attrs) => {
    const stripped = attrs.replace(/\sfill\s*=\s*"[^"]*"/gi, "");
    return `<svg${stripped} fill="#ffffff">`;
  });
  return out;
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".svg"));
for (const file of files) {
  const raw = await readFile(path.join(SRC_DIR, file), "utf8");
  const whitened = whitenSvg(raw);
  const resvg = new Resvg(whitened, {
    fitTo: { mode: "height", value: TARGET_HEIGHT_PX },
    background: "rgba(0, 0, 0, 0)",
  });
  const png = resvg.render().asPng();
  const outName = file.replace(/\.svg$/, ".png");
  await writeFile(path.join(OUT_DIR, outName), png);
  console.log(`✓ ${file} → white/${outName} (${png.length} bytes)`);
}
