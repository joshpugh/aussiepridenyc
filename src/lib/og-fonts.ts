import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedDancingScript: ArrayBuffer | null = null;
let cachedFrauncesBold: ArrayBuffer | null = null;

async function loadWoff(relativePath: string): Promise<ArrayBuffer> {
  const file = await readFile(path.join(process.cwd(), relativePath));
  return file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  ) as ArrayBuffer;
}

export async function loadDancingScript(): Promise<ArrayBuffer> {
  if (cachedDancingScript) return cachedDancingScript;
  // Fontsource ships static-weight .woff files (satori chokes on variable TTFs).
  cachedDancingScript = await loadWoff(
    "node_modules/@fontsource/dancing-script/files/dancing-script-latin-700-normal.woff",
  );
  return cachedDancingScript;
}

export async function loadFraunces(): Promise<ArrayBuffer> {
  if (cachedFrauncesBold) return cachedFrauncesBold;
  cachedFrauncesBold = await loadWoff(
    "node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff",
  );
  return cachedFrauncesBold;
}
