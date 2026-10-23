import {
  NEEVAI_AGENT_ID,
  NEEVAI_CHAT_ORIGIN,
  NEEVAI_MAX_MESSAGE_LENGTH,
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
 * Builds the NeevAI full-page chat URL. Used when the widget script is not
 * available on the page. The question is not added to the URL, so it does not
 * end up in browser history or server logs (users may paste secret keys).
 */
export const getNeevaiFullPageUrl = () => {
  const params = new URLSearchParams({
    embed: "true",
    mode: "fullpage",
  });

  return `${NEEVAI_CHAT_ORIGIN}/assistant/${NEEVAI_AGENT_ID}?${params.toString()}`;
};

/**
 * Opens the NeevAI chat and sends `question` as the first message. Falls back
 * to the full-page chat in a new tab if the widget script has not loaded; the
 * user retypes the question there.
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

  openUrl(getNeevaiFullPageUrl());
};
