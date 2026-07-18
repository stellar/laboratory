/**
 * Splits pasted XDR input into individual base64 blocks. Drops `//` comment
 * lines (e.g. the `// contractspecv0` header the Contract Explorer emits),
 * splits on blank lines so each entry is its own block, and collapses
 * whitespace within a block. A single blob returns `[blob]`.
 *
 * @param raw - The raw text pasted into the XDR input.
 * @returns An array of clean base64 blocks (empty blocks are dropped).
 */
export const splitXdrBlocks = (raw: string): string[] => {
  if (!raw) {
    return [];
  }

  return raw
    .split(/\n\s*\n/) // blank lines separate entries
    .map((block) =>
      block
        .split("\n")
        .filter((line) => !line.trim().startsWith("//")) // drop comment lines
        .join("")
        .replace(/\s+/g, ""),
    ) // base64 has no internal whitespace
    .filter(Boolean);
};
