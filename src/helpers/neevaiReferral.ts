// Links in the Ask Stellar chat (NeevAI) carry `utm_source=neevai`. These
// helpers read and remove those tags on landing. They work on the raw query
// string because `URLSearchParams` would re-encode the store's `$=...;;`
// segment so zustand-querystring can no longer read it.

const NEEVAI_UTM_SOURCE = "neevai";
// Only these are sent to analytics; values come from links anyone can craft
const REFERRAL_UTM_KEYS = [
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const MAX_UTM_VALUE_LENGTH = 100;

// Same matcher zustand-querystring uses for its `$` key
const STORE_SEGMENT_MATCHER = /\$=.*;;|\$=.*$/;

export type NeevaiReferral = Partial<
  Record<(typeof REFERRAL_UTM_KEYS)[number], string>
>;

/**
 * Splits a query string into the store's `$=...` segment (kept verbatim) and
 * the remaining `key=value` pairs.
 */
const splitSearch = (search: string) => {
  const query = search.startsWith("?") ? search.substring(1) : search;
  const storeSegment = query.match(STORE_SEGMENT_MATCHER)?.[0] ?? "";
  const otherPairs = query
    .replace(STORE_SEGMENT_MATCHER, "")
    .split("&")
    .filter(Boolean);

  return { storeSegment, otherPairs };
};

const decode = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return value;
  }
};

/**
 * Returns the allowlisted UTM values when the visitor arrived from the Ask
 * Stellar chat (`utm_source=neevai`), or `null` otherwise. Values are capped at
 * 100 characters.
 */
export const parseNeevaiReferral = (search: string): NeevaiReferral | null => {
  const params = splitSearch(search).otherPairs.reduce(
    (res, pair) => {
      const [key, ...rest] = pair.split("=");
      res[decode(key)] = decode(rest.join("="));
      return res;
    },
    {} as Record<string, string>,
  );

  if (params.utm_source !== NEEVAI_UTM_SOURCE) {
    return null;
  }

  return REFERRAL_UTM_KEYS.reduce((res, key) => {
    if (params[key]) {
      res[key] = params[key].slice(0, MAX_UTM_VALUE_LENGTH);
    }

    return res;
  }, {} as NeevaiReferral);
};

/**
 * Removes all `utm_*` params from a query string, leaving the store's
 * `$=...;;` segment byte-identical. Returns `""` when nothing is left.
 */
export const stripUtmParams = (search: string) => {
  const { storeSegment, otherPairs } = splitSearch(search);
  const kept = otherPairs.filter(
    (pair) => !decode(pair.split("=")[0]).startsWith("utm_"),
  );

  if (storeSegment) {
    kept.push(storeSegment);
  }

  return kept.length ? `?${kept.join("&")}` : "";
};
