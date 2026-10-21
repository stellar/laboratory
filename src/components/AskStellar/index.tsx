"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@stellar/design-system";

import { NEEVAI_AGENT_ID, NEEVAI_CHAT_ORIGIN } from "@/constants/settings";
import { setNeevaiAskHandler } from "@/helpers/askNeevai";
import {
  createNeevaiAskQueue,
  getNeevaiWidgetUrl,
  NeevaiOutboundMessage,
  NeevaiPanelState,
  NeevaiTheme,
  parseNeevaiMessage,
} from "@/helpers/neevaiEmbed";
import { useStore } from "@/store/useStore";

import "./styles.scss";

// The iframe can run scripts, keep its own storage (on NeevAI's origin), and
// open links in new tabs. It cannot navigate or script the Lab page.
const IFRAME_SANDBOX = [
  "allow-scripts",
  "allow-same-origin",
  "allow-forms",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
].join(" ");

/**
 * "Ask Stellar" chat launcher. Renders Lab's own button and panel, and loads
 * the NeevAI chat as a sandboxed cross-origin iframe on first open. No NeevAI
 * script runs on Lab's origin; Lab and the chat talk only through
 * origin-checked `postMessage`.
 *
 * Registers itself with `askNeevai()` so the homepage input can open the panel
 * and send a question.
 */
export const AskStellar = () => {
  const { theme } = useStore();
  const chatTheme: NeevaiTheme = theme === "sds-theme-dark" ? "dark" : "light";

  const [panelState, setPanelState] = useState<NeevaiPanelState>("collapsed");
  // The iframe is created on first open (or hover/focus of the button) and
  // then kept so the conversation survives closing the panel.
  const [isFrameMounted, setIsFrameMounted] = useState(false);
  // Theme at the moment the iframe was created; later changes go by message
  const [frameTheme, setFrameTheme] = useState<NeevaiTheme>(chatTheme);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const isFrameReadyRef = useRef(false);
  // Latest values for the message listener, which is registered once
  const panelStateRef = useRef(panelState);
  const chatThemeRef = useRef(chatTheme);
  panelStateRef.current = panelState;
  chatThemeRef.current = chatTheme;

  const post = useCallback((message: NeevaiOutboundMessage) => {
    frameRef.current?.contentWindow?.postMessage(message, NEEVAI_CHAT_ORIGIN);
  }, []);

  const askQueueRef = useRef<ReturnType<typeof createNeevaiAskQueue> | null>(
    null,
  );

  if (!askQueueRef.current) {
    askQueueRef.current = createNeevaiAskQueue({
      post,
      schedule: (callback, delayMs) => {
        const timeout = setTimeout(callback, delayMs);
        return () => clearTimeout(timeout);
      },
    });
  }

  const mountFrame = useCallback(() => {
    if (!isFrameMounted) {
      setFrameTheme(chatTheme);
      setIsFrameMounted(true);
    }
  }, [chatTheme, isFrameMounted]);

  const openPanel = useCallback(
    (state: Exclude<NeevaiPanelState, "collapsed"> = "widget") => {
      mountFrame();
      setPanelState(state);
    },
    [mountFrame],
  );

  const closePanel = useCallback(() => {
    setPanelState("collapsed");
    launcherRef.current?.focus();
  }, []);

  // Let `askNeevai()` (homepage input) open the panel and send a question
  useEffect(
    () =>
      setNeevaiAskHandler((question) => {
        openPanel();
        askQueueRef.current?.ask(question, true);
      }),
    [openPanel],
  );

  // Messages from the chat iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = parseNeevaiMessage(
        event,
        frameRef.current?.contentWindow,
      );

      if (!message) {
        return;
      }

      switch (message.type) {
        case "NEEVAI_READY":
          isFrameReadyRef.current = true;

          if (panelStateRef.current !== "collapsed") {
            post({ type: "NEEVAI_STATE", state: panelStateRef.current });
          }

          post({
            type: "THEME_MODE",
            assistantId: NEEVAI_AGENT_ID,
            mode: chatThemeRef.current,
          });
          askQueueRef.current?.ready(message.protocol);
          break;
        case "NEEVAI_ASK_RECEIVED":
          askQueueRef.current?.acknowledge(message.id);
          break;
        case "NEEVAI_CLOSE":
          closePanel();
          break;
        case "NEEVAI_EXPAND":
          setPanelState("expanded");
          break;
        case "NEEVAI_FULLSCREEN":
          setPanelState("fullscreen");
          break;
        case "NEEVAI_MINIMIZE":
          setPanelState("widget");
          break;
        default:
        // Do nothing
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [closePanel, post]);

  // Tell the chat which size it is shown at (it adjusts its header buttons)
  useEffect(() => {
    if (panelState !== "collapsed" && isFrameReadyRef.current) {
      post({ type: "NEEVAI_STATE", state: panelState });
    }
  }, [panelState, post]);

  // Keep the chat theme in sync with Lab's theme
  useEffect(() => {
    if (isFrameReadyRef.current) {
      post({
        type: "THEME_MODE",
        assistantId: NEEVAI_AGENT_ID,
        mode: chatTheme,
      });
    }
  }, [chatTheme, post]);

  // Escape closes the panel when focus is on the Lab page
  useEffect(() => {
    if (panelState === "collapsed") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [panelState, closePanel]);

  useEffect(() => () => askQueueRef.current?.reset(), []);

  const isOpen = panelState !== "collapsed";

  return (
    <>
      {panelState === "fullscreen" ? (
        <div className="AskStellar__backdrop" onClick={closePanel} />
      ) : null}

      <div
        className="AskStellar__panel"
        role="dialog"
        aria-label="Ask Stellar chat"
        aria-hidden={!isOpen}
        data-state={panelState}
      >
        {isFrameMounted ? (
          <iframe
            ref={frameRef}
            className="AskStellar__frame"
            title="Ask Stellar chat"
            src={getNeevaiWidgetUrl(frameTheme)}
            sandbox={IFRAME_SANDBOX}
            allow="clipboard-write"
            referrerPolicy="strict-origin"
            onLoad={() => {
              if (isOpen) {
                frameRef.current?.focus();
              }
            }}
          />
        ) : null}
      </div>

      <button
        ref={launcherRef}
        type="button"
        className="AskStellar__launcher"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close Ask Stellar chat" : "Open Ask Stellar chat"}
        data-is-open={isOpen}
        onClick={() => (isOpen ? closePanel() : openPanel())}
        // Start loading the chat as soon as the visitor shows intent
        onPointerEnter={mountFrame}
        onFocus={mountFrame}
      >
        {isOpen ? <Icon.XClose /> : <Icon.Stars02 />}
        {isOpen ? null : (
          <span className="AskStellar__launcher__label">Ask Stellar</span>
        )}
      </button>
    </>
  );
};
