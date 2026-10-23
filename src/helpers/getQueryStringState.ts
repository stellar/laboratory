import { parse } from "zustand-querystring";
import { AnyObject } from "@/types/types";

// Same matcher zustand-querystring uses to find its state (`$=...;;`)
// anywhere in the query string, so these helpers and the store always agree.
// nested objects produce `;;` mid-string (e.g. `a$b$c:1;;&d:2`).
const STATE_MATCHER = /\$=(.*);;|\$=(.*)$/;

/**
 * Parses the zustand-querystring state from a URL query string. The state
 * doesn't have to come first, so params added by others (e.g.
 * `?utm_source=neevai&$=...;;`) don't hide it.
 *
 * @param search - Query string, with or without the leading `?`
 * @returns Parsed state, or `null` if there is no `$=` state
 */
export const getQueryStringState = (search: string): AnyObject | null => {
  const match = search.match(STATE_MATCHER);

  if (!match) {
    return null;
  }

  return parse(match[1] ?? match[2]);
};
