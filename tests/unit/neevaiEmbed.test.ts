import {
  createNeevaiAskQueue,
  getNeevaiWidgetUrl,
  NeevaiOutboundMessage,
  parseNeevaiMessage,
} from "@/helpers/neevaiEmbed";
import { NEEVAI_AGENT_ID, NEEVAI_CHAT_ORIGIN } from "@/constants/settings";

describe("getNeevaiWidgetUrl", () => {
  it("builds the widget iframe URL", () => {
    const url = new URL(getNeevaiWidgetUrl("dark"));

    expect(url.origin).toBe(NEEVAI_CHAT_ORIGIN);
    expect(url.pathname).toBe(`/assistant/${NEEVAI_AGENT_ID}`);
    expect(url.searchParams.get("embed")).toBe("true");
    expect(url.searchParams.get("mode")).toBe("widget");
    expect(url.searchParams.get("theme")).toBe("dark");
  });
});

describe("parseNeevaiMessage", () => {
  const frameWindow = {} as Window;

  it("accepts a known message from the chat iframe", () => {
    expect(
      parseNeevaiMessage(
        {
          origin: NEEVAI_CHAT_ORIGIN,
          source: frameWindow,
          data: { type: "NEEVAI_READY", protocol: 2 },
        },
        frameWindow,
      ),
    ).toEqual({ type: "NEEVAI_READY", protocol: 2 });
  });

  it("rejects messages from another origin", () => {
    expect(
      parseNeevaiMessage(
        {
          origin: "https://evil.example",
          source: frameWindow,
          data: { type: "NEEVAI_CLOSE" },
        },
        frameWindow,
      ),
    ).toBeNull();
  });

  it("rejects messages from another window on the chat origin", () => {
    expect(
      parseNeevaiMessage(
        {
          origin: NEEVAI_CHAT_ORIGIN,
          source: {} as Window,
          data: { type: "NEEVAI_CLOSE" },
        },
        frameWindow,
      ),
    ).toBeNull();
  });

  it("rejects unknown or malformed messages", () => {
    const parse = (data: unknown) =>
      parseNeevaiMessage(
        { origin: NEEVAI_CHAT_ORIGIN, source: frameWindow, data },
        frameWindow,
      );

    expect(parse({ type: "SOMETHING_ELSE" })).toBeNull();
    expect(parse("NEEVAI_CLOSE")).toBeNull();
    expect(parse(null)).toBeNull();
    expect(parse({ type: "NEEVAI_ASK_RECEIVED" })).toBeNull();
  });

  it("rejects everything before the iframe exists", () => {
    expect(
      parseNeevaiMessage(
        {
          origin: NEEVAI_CHAT_ORIGIN,
          source: frameWindow,
          data: { type: "NEEVAI_CLOSE" },
        },
        null,
      ),
    ).toBeNull();
  });
});

describe("createNeevaiAskQueue", () => {
  const setup = () => {
    const posted: NeevaiOutboundMessage[] = [];
    const scheduled: (() => void)[] = [];

    const queue = createNeevaiAskQueue({
      post: (message) => posted.push(message),
      schedule: (callback) => {
        scheduled.push(callback);
        return () => {
          const index = scheduled.indexOf(callback);

          if (index >= 0) {
            scheduled.splice(index, 1);
          }
        };
      },
    });

    const runScheduled = () => scheduled.splice(0).forEach((cb) => cb());

    return { queue, posted, scheduled, runScheduled };
  };

  it("holds the question until the chat is ready", () => {
    const { queue, posted } = setup();

    queue.ask("How do I fund an account?", true);
    expect(posted).toHaveLength(0);

    queue.ready(2);
    expect(posted).toEqual([
      expect.objectContaining({
        type: "neevai:ask",
        question: "How do I fund an account?",
        autosend: true,
      }),
    ]);
  });

  it("retries until the chat acknowledges the question", () => {
    const { queue, posted, scheduled, runScheduled } = setup();

    queue.ready(2);
    queue.ask("Hello", true);
    runScheduled();
    expect(posted).toHaveLength(2);

    const { id } = posted[0] as Extract<
      NeevaiOutboundMessage,
      { type: "neevai:ask" }
    >;
    queue.acknowledge(id);

    expect(scheduled).toHaveLength(0);
    runScheduled();
    expect(posted).toHaveLength(2);
  });

  it("gives up after 20 attempts", () => {
    const { queue, posted, scheduled, runScheduled } = setup();

    queue.ready(2);
    queue.ask("Hello", true);

    for (let i = 0; i < 30; i++) {
      runScheduled();
    }

    expect(posted).toHaveLength(20);
    expect(scheduled).toHaveLength(0);
  });

  it("sends once without retries on older protocols", () => {
    const { queue, posted, scheduled } = setup();

    queue.ready(1);
    queue.ask("Hello", true);

    expect(posted).toHaveLength(1);
    expect(scheduled).toHaveLength(0);
  });

  it("drops the pending question on reset", () => {
    const { queue, posted } = setup();

    queue.ask("Hello", true);
    queue.reset();
    queue.ready(2);

    expect(posted).toHaveLength(0);
  });
});
