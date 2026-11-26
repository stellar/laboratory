"use client";

import { useContext, useEffect } from "react";
import { installWebMCP } from "@mcp-b/webmcp-polyfill";

import { ZustandContext } from "@/store/StoreProvider";
import { getPublicResourcePath } from "@/helpers/getPublicResourcePath";
import { createLabTools, LabTool } from "@/webmcp/tools";

// Must match the relay: start it with `--invoke-timeout 125000`.
const REQUEST_TIMEOUT_MS = 120_000;
const RELAY_PORT = 9333;
const TAB_ID_KEY = "stellar_lab_webmcp_tab_id";

type ModelContextLike = {
  registerTool: (
    tool: LabTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
};

const getTabId = () => {
  try {
    const existing = sessionStorage.getItem(TAB_ID_KEY);

    if (existing) {
      return existing;
    }

    const id = crypto.randomUUID();
    sessionStorage.setItem(TAB_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

/**
 * Adds the hidden same-origin relay widget (public/webmcp/widget.html). It
 * reads this page's document.modelContext tools and forwards them over a
 * loopback WebSocket to @mcp-b/webmcp-local-relay, which desktop agents
 * (Claude, Codex) launch as a stdio MCP server.
 */
const mountRelayWidget = () => {
  // Don't send Lab's querystring state (it can hold user input) to the relay.
  const hostUrl = new URL(window.location.href);
  hostUrl.search = "";
  hostUrl.hash = "";

  const params = new URLSearchParams({
    hostOrigin: window.location.origin,
    hostUrl: hostUrl.href,
    hostTitle: document.title,
    relayPort: String(RELAY_PORT),
    requestTimeout: String(REQUEST_TIMEOUT_MS),
    tabId: getTabId(),
  });

  const iframe = document.createElement("iframe");
  iframe.src = `${getPublicResourcePath("/webmcp/widget.html")}?${params}`;
  iframe.style.display = "none";
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("data-webmcp-relay", "1");
  // Chrome's Local Network Access permission for the loopback WebSocket.
  iframe.setAttribute(
    "allow",
    "loopback-network; local-network; local-network-access",
  );
  document.body.appendChild(iframe);

  return iframe;
};

/**
 * Registers Stellar Lab's WebMCP tools and connects them to a local relay.
 * Rendered only when NEXT_PUBLIC_ENABLE_WEBMCP=true (see app/layout.tsx).
 */
export const WebMcpBridge = () => {
  const store = useContext(ZustandContext);

  useEffect(() => {
    if (!store) {
      return;
    }

    installWebMCP();

    const modelContext = (
      document as Document & { modelContext?: ModelContextLike }
    ).modelContext;

    if (!modelContext) {
      console.warn("[Lab WebMCP] document.modelContext is unavailable.");
      return;
    }

    const controller = new AbortController();
    const tools = createLabTools(
      () => store.getState(),
      () => window.location.pathname,
    );

    tools.forEach((tool) => {
      Promise.resolve(
        modelContext.registerTool(tool, { signal: controller.signal }),
      ).catch((e) => {
        if (!controller.signal.aborted) {
          console.warn(`[Lab WebMCP] Could not register ${tool.name}:`, e);
        }
      });
    });

    const iframe = mountRelayWidget();

    // Same as the relay's embed.js: reconnect when the tab becomes visible.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        iframe.contentWindow?.postMessage(
          { type: "webmcp.connect" },
          window.location.origin,
        );
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      iframe.remove();
    };
  }, [store]);

  return null;
};
