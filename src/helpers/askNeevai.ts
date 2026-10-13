import {
  NEEVAI_AGENT_ID,
  NEEVAI_CHAT_ORIGIN,
  NEEVAI_MAX_MESSAGE_LENGTH,
  NEEVAI_MAX_URL_QUESTION_LENGTH,
} from "@/constants/settings";
import { openUrl } from "@/helpers/openUrl";

declare global {
  interface Window {
    NeevaiChat?: {
      submit: (text: string) => void;
      ask: (text: string) => void;
      open: () => void;
      close: () => void;
    };
  }
}

/**
 * Builds the NeevAI full-page chat URL that opens with `question` and sends it.
 * Used when the widget script is not available on the page.
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
 * Opens the NeevAI chat and sends `question` as the first message. Falls back
 * to the full-page chat in a new tab if the widget script has not loaded.
 */
export const askNeevai = (question: string) => {
  const text = question.trim().slice(0, NEEVAI_MAX_MESSAGE_LENGTH);

  if (!text || typeof window === "undefined") {
    return;
  }

  if (window.NeevaiChat) {
    window.NeevaiChat.submit(text);
    return;
  }

  openUrl(getNeevaiFullPageUrl(text));
};
