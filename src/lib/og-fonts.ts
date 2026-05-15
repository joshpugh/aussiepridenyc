import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedGreatVibes: ArrayBuffer | null = null;

export async function loadGreatVibes(): Promise<ArrayBuffer> {
  if (cachedGreatVibes) return cachedGreatVibes;
  const file = await readFile(
    path.join(process.cwd(), "src/fonts/GreatVibes-Regular.ttf"),
  );
  cachedGreatVibes = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  ) as ArrayBuffer;
  return cachedGreatVibes;
}
