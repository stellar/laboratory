import { Buffer } from "buffer";

// Base64 characters, padding, and whitespace only
const BASE64_WITH_WHITESPACE_REGEX = /^[A-Za-z0-9+/=\s]+$/;
// One base64 value, ending at its padding (if any)
const BASE64_CHUNK_REGEX = /[A-Za-z0-9+/]+={0,2}/g;

/**
 * Joins separately encoded base64 XDR values into a single base64 XDR stream.
 *
 * Concatenates the decoded bytes, not the base64 strings: gluing padded base64
 * strings together leaves `=` mid-string, which is not valid base64.
 *
 * @param xdrs - Base64 encoded XDR values
 * @returns One base64 encoded stream of all values
 */
export const joinXdrStream = (xdrs: string[]): string =>
  Buffer.concat(xdrs.map((x) => Buffer.from(x, "base64"))).toString("base64");

/**
 * Turns multiple base64 XDR values pasted together (separated by whitespace or
 * glued after `=` padding) into a single base64 XDR stream.
 *
 * Input that is a single base64 value, or that has non-base64 characters, is
 * returned unchanged.
 *
 * @param input - Base64 encoded XDR, possibly multiple values
 * @returns A single base64 encoded XDR stream
 */
export const normalizeXdrStream = (input: string): string => {
  if (!BASE64_WITH_WHITESPACE_REGEX.test(input)) {
    return input;
  }

  const chunks = input.match(BASE64_CHUNK_REGEX) || [];

  return chunks.length > 1 ? joinXdrStream(chunks) : input;
};
