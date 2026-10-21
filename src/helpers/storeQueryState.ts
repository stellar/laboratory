import { parse } from "zustand-querystring";

import { AnyObject } from "@/types/types";

// Same matcher zustand-querystring uses for its `$` key
const STORE_STATE_MATCHER = /\$=(.*);;|\$=(.*)$/;

/**
 * Returns the store state saved in the query string (`$=...;;`), wherever it
 * sits among other params (for example `?utm_source=x&$=...;;`). Returns an
 * empty object when there is none.
 */
export const getStoreQueryState = (search: string): AnyObject => {
  const match = search.match(STORE_STATE_MATCHER);

  if (!match) {
    return {};
  }

  try {
    return (parse(match[1] ?? match[2]) as AnyObject) ?? {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {};
  }
};
