"use client";

import Script from "next/script";

import { NEEVAI_SCRIPT_URL } from "@/constants/settings";

/**
 * Loads the NeevAI chat widget ("Ask Stellar"). Adds the chat bubble to every
 * page and exposes `window.NeevaiChat` for the homepage input.
 */
export const NeevaiChatScript = () => (
  <Script
    id="neevai-chat"
    src={NEEVAI_SCRIPT_URL}
    strategy="afterInteractive"
  />
);
