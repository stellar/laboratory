// Campaign attribution (e.g. links from the NeevAI chat) for Amplitude events.
// UTM params only exist on the landing URL: every in-app link is rebuilt from
// the `$=` store state, so they are gone after the first navigation. We keep
// them in sessionStorage so later events in the same tab are still attributed,
// without leaking them into shared links or later visits.

export const ATTRIBUTION_STORAGE_KEY = "stellar_lab_attribution";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const MAX_VALUE_LENGTH = 100;

type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = Partial<Record<UtmKey, string>> & {
  landing_path?: string;
};

/**
 * Reads the UTM params from a URL query string. Only reads the params, so the
 * `$=` store state in the same query string is left alone.
 *
 * @param search - Query string, with or without the leading `?`
 * @returns UTM values (trimmed and length-capped), or `null` if there is no
 * `utm_source`
 */
export const getUtmParams = (search: string): Attribution | null => {
  const params = new URLSearchParams(search);
  const utm: Attribution = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key)?.trim().slice(0, MAX_VALUE_LENGTH);

    if (value) {
      utm[key] = value;
    }
  });

  return utm.utm_source ? utm : null;
};

/**
 * Saves the landing URL's UTM params to sessionStorage. A new landing with UTM
 * params replaces the saved ones (last touch); a landing without them keeps
 * the saved ones.
 *
 * @param search - Landing query string (`window.location.search`)
 * @param pathname - Landing path, saved without the query string
 */
export const captureAttribution = (search: string, pathname: string) => {
  const utm = getUtmParams(search);

  if (!utm) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({ ...utm, landing_path: pathname }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Storage can be unavailable (e.g. blocked site data); skip attribution
  }
};

/**
 * Gets the attribution saved for this tab.
 *
 * @returns Saved attribution, or an empty object if there is none
 */
export const getAttribution = (): Attribution => {
  try {
    const saved = JSON.parse(
      window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "null",
    );

    if (!saved || typeof saved !== "object") {
      return {};
    }

    // Only pass on known string fields
    return [...UTM_KEYS, "landing_path" as const].reduce((res, key) => {
      if (typeof saved[key] === "string") {
        res[key] = saved[key];
      }

      return res;
    }, {} as Attribution);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {};
  }
};
