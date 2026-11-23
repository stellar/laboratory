import { getNeevaiFullPageUrl } from "@/helpers/askNeevai";
import { NEEVAI_AGENT_ID } from "@/constants/settings";

describe("getNeevaiFullPageUrl", () => {
  it("opens the full-page chat without the question", () => {
    const url = new URL(getNeevaiFullPageUrl());

    expect(url.origin).toBe("https://prism-chat.neevai.io");
    expect(url.pathname).toBe(`/assistant/${NEEVAI_AGENT_ID}`);
    expect(url.searchParams.get("mode")).toBe("fullpage");
    expect(url.searchParams.has("q")).toBe(false);
    expect(url.searchParams.has("autosend")).toBe(false);
  });
});
