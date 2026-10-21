import {
  NEEVAI_AGENT_ID,
  NEEVAI_CHAT_ORIGIN,
  NEEVAI_MAX_MESSAGE_LENGTH,
  NEEVAI_MAX_URL_QUESTION_LENGTH,
} from "@/constants/settings";
import { openUrl } from "@/helpers/openUrl";

type NeevaiAskHandler = (question: string) => void;

// Set by the mounted `AskStellar` panel; `null` when it is not on the page
let askHandler: NeevaiAskHandler | null = null;

/**
 * Registers the function that opens the Ask Stellar panel and sends a
 * question. Returns a cleanup that unregisters it.
 */
export const setNeevaiAskHandler = (handler: NeevaiAskHandler) => {
  askHandler = handler;

  return () => {
    if (askHandler === handler) {
      askHandler = null;
    }
  };
};

/**
 * Builds the NeevAI full-page chat URL that opens with `question` and sends it.
 * Used when the Ask Stellar panel is not available on the page.
 */
export const getNeevaiFullPageUrl = (question: string) => {
  const params = new URLSearchParams({
    embed: "true",
    mode: "fullpage",
    q: question.trim().slice(0, NEEVAI_MAX_URL_QUESTION_LENGTH),
    autosend: "1",
  });

  return `${NEEVAI_CHAT_ORIGIN}/assistant/${NEEVAI_AGENT_ID}?${params.toString()}`;
};

/**
 * Opens the Ask Stellar panel and sends `question`. Falls back to the
 * full-page chat in a new tab if the panel is not mounted.
 */
export const askNeevai = (question: string) => {
  const text = question.trim().slice(0, NEEVAI_MAX_MESSAGE_LENGTH);

  if (!text || typeof window === "undefined") {
    return;
  }

  if (askHandler) {
    askHandler(text);
    return;
  }

  openUrl(getNeevaiFullPageUrl(text));
};
