import {
  NEEVAI_AGENT_ID,
  NEEVAI_CHAT_ORIGIN,
  NEEVAI_EMBED_PROTOCOL,
} from "@/constants/settings";

// Message protocol between Lab and the NeevAI chat iframe. Lab talks to the
// iframe only through `postMessage`, pinned to `NEEVAI_CHAT_ORIGIN` in both
// directions, so NeevAI code never runs on Lab's origin.

export type NeevaiPanelState =
  | "collapsed"
  | "widget"
  | "expanded"
  | "fullscreen";

export type NeevaiTheme = "light" | "dark";

/** Messages the chat iframe sends to Lab. */
export type NeevaiInboundMessage =
  | { type: "NEEVAI_READY"; protocol?: number }
  | { type: "NEEVAI_ASK_RECEIVED"; id: string }
  | { type: "NEEVAI_CLOSE" }
  | { type: "NEEVAI_EXPAND" }
  | { type: "NEEVAI_FULLSCREEN" }
  | { type: "NEEVAI_MINIMIZE" };

/** Messages Lab sends to the chat iframe. */
export type NeevaiOutboundMessage =
  | {
      type: "neevai:ask";
      id: string;
      question: string;
      autosend: boolean;
    }
  | { type: "NEEVAI_STATE"; state: Exclude<NeevaiPanelState, "collapsed"> }
  | { type: "THEME_MODE"; assistantId: string; mode: NeevaiTheme };

const INBOUND_TYPES = [
  "NEEVAI_READY",
  "NEEVAI_ASK_RECEIVED",
  "NEEVAI_CLOSE",
  "NEEVAI_EXPAND",
  "NEEVAI_FULLSCREEN",
  "NEEVAI_MINIMIZE",
];

// How often and how many times to resend a question until the chat
// acknowledges it (matches NeevAI's own launcher)
const ASK_RETRY_INTERVAL_MS = 500;
const ASK_MAX_ATTEMPTS = 20;

/**
 * Builds the URL of the NeevAI chat iframe in widget mode.
 */
export const getNeevaiWidgetUrl = (theme?: NeevaiTheme) => {
  const params = new URLSearchParams({ embed: "true", mode: "widget" });

  if (theme) {
    params.set("theme", theme);
  }

  return `${NEEVAI_CHAT_ORIGIN}/assistant/${encodeURIComponent(NEEVAI_AGENT_ID)}?${params.toString()}`;
};

/**
 * Returns the message if it came from the NeevAI chat iframe and has a known
 * shape. Returns `null` for anything else, so messages from other windows or
 * origins are ignored.
 */
export const parseNeevaiMessage = (
  event: Pick<MessageEvent, "origin" | "source" | "data">,
  frameWindow: Window | null | undefined,
): NeevaiInboundMessage | null => {
  if (
    !frameWindow ||
    event.source !== frameWindow ||
    event.origin !== NEEVAI_CHAT_ORIGIN
  ) {
    return null;
  }

  const data = event.data;

  if (!data || typeof data !== "object" || !INBOUND_TYPES.includes(data.type)) {
    return null;
  }

  if (data.type === "NEEVAI_ASK_RECEIVED" && typeof data.id !== "string") {
    return null;
  }

  return data as NeevaiInboundMessage;
};

/**
 * Holds the pending question until the chat iframe is ready, then sends it.
 * On protocol 2+ the chat acknowledges each question, so the question is
 * resent every 500ms (up to 20 times) until acknowledged. Older protocols get
 * it once.
 */
export const createNeevaiAskQueue = ({
  post,
  schedule,
}: {
  post: (message: NeevaiOutboundMessage) => void;
  schedule: (callback: () => void, delayMs: number) => () => void;
}) => {
  let pending: Extract<NeevaiOutboundMessage, { type: "neevai:ask" }> | null =
    null;
  let isReady = false;
  let expectsAck = false;
  let attempts = 0;
  let count = 0;
  let cancelRetry: (() => void) | null = null;

  const clearRetry = () => {
    cancelRetry?.();
    cancelRetry = null;
  };

  const flush = () => {
    clearRetry();

    if (!pending || !isReady) {
      return;
    }

    post(pending);
    attempts += 1;

    if (!expectsAck || attempts >= ASK_MAX_ATTEMPTS) {
      pending = null;
      return;
    }

    cancelRetry = schedule(flush, ASK_RETRY_INTERVAL_MS);
  };

  return {
    /** Queues `question` (replacing any unsent one) and sends it when ready. */
    ask(question: string, autosend: boolean) {
      count += 1;
      pending = {
        type: "neevai:ask",
        id: `${Date.now().toString(36)}-${count}`,
        question,
        autosend,
      };
      attempts = 0;
      flush();
    },
    /** Marks the chat ready (NEEVAI_READY) and sends any pending question. */
    ready(protocol?: number) {
      isReady = true;
      expectsAck =
        typeof protocol === "number" && protocol >= NEEVAI_EMBED_PROTOCOL;
      attempts = 0;
      flush();
    },
    /** Stops resending once the chat confirms it got the question. */
    acknowledge(id: string) {
      if (pending?.id === id) {
        pending = null;
        clearRetry();
      }
    },
    /** Drops any pending question and stops retrying. */
    reset() {
      clearRetry();
      pending = null;
      isReady = false;
      expectsAck = false;
    },
  };
};
