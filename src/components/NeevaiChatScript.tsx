"use client";

import Script from "next/script";

import {
  NEEVAI_AGENT_ID,
  NEEVAI_SCRIPT_INTEGRITY,
  NEEVAI_SCRIPT_URL,
} from "@/constants/settings";

/**
 * Loads the NeevAI chat widget ("Ask Stellar"). Adds the chat bubble to every
 * page and exposes `window.NeevaiChat` for the homepage input. The script is
 * pinned with SRI, so the browser blocks it if its contents change.
 */
export const NeevaiChatScript = () => (
  <Script
    id="neevai-chat"
    src={NEEVAI_SCRIPT_URL}
    integrity={NEEVAI_SCRIPT_INTEGRITY}
    crossOrigin="anonymous"
    data-assistant-id={NEEVAI_AGENT_ID}
    strategy="afterInteractive"
  />
);
