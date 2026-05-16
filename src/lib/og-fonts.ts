import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedDancingScript: ArrayBuffer | null = null;

export async function loadDancingScript(): Promise<ArrayBuffer> {
  if (cachedDancingScript) return cachedDancingScript;
  // Fontsource ships static-weight .woff files (satori chokes on variable TTFs).
  const file = await readFile(
    path.join(
      process.cwd(),
      "node_modules/@fontsource/dancing-script/files/dancing-script-latin-700-normal.woff",
    ),
  );
  cachedDancingScript = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  ) as ArrayBuffer;
  return cachedDancingScript;
}
