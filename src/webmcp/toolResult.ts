// Shared helpers for WebMCP tool results.
//
// Every tool result goes through `toolResult`, which strips anything that
// looks like a Stellar secret key before the text leaves the page. Keys are
// also dropped by name in `redactSecrets` so they never reach the agent even if
// a future store field holds one in a non-standard format.

// A Stellar secret seed: "S" followed by 55 base32 characters.
const SECRET_SEED_RE = /\bS[A-Z2-7]{55}\b/g;
const SENSITIVE_KEY_RE =
  /secret|seed|mnemonic|recovery|private|password|headerValue/i;
const MAX_TEXT_LENGTH = 200_000;

export type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

export const redactSecretSeeds = (text: string) =>
  text.replace(SECRET_SEED_RE, "[redacted secret key]");

/** Deep copy without sensitive keys; secret seeds in strings are masked. */
export const redactSecrets = (value: unknown): unknown => {
  if (typeof value === "string") {
    return redactSecretSeeds(value);
  }

  if (Array.isArray(value)) {
    return value.map(redactSecrets);
  }

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      if (SENSITIVE_KEY_RE.test(key) || typeof val === "function") {
        continue;
      }

      out[key] = redactSecrets(val);
    }

    return out;
  }

  return value;
};

const capLength = (text: string) =>
  text.length > MAX_TEXT_LENGTH
    ? `${text.slice(0, MAX_TEXT_LENGTH)}\n…[truncated ${text.length - MAX_TEXT_LENGTH} characters]`
    : text;

/** Wraps already-serialized JSON (e.g. lossless XDR JSON) as a tool result. */
export const rawJsonResult = (json: string): ToolResult => ({
  content: [{ type: "text", text: capLength(redactSecretSeeds(json)) }],
});

export const toolResult = (value: unknown): ToolResult =>
  rawJsonResult(JSON.stringify(redactSecrets(value), null, 2));

export const toolError = (message: string): ToolResult => ({
  content: [{ type: "text", text: redactSecretSeeds(message) }],
  isError: true,
});

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);
