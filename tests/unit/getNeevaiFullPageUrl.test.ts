import { getNeevaiFullPageUrl } from "@/helpers/askNeevai";
import {
  NEEVAI_AGENT_ID,
  NEEVAI_MAX_URL_QUESTION_LENGTH,
} from "@/constants/settings";

describe("getNeevaiFullPageUrl", () => {
  it("encodes the question and autosends", () => {
    const url = new URL(
      getNeevaiFullPageUrl("  How do I fund a test account?  "),
    );

    expect(url.origin).toBe("https://prism-chat.neevai.io");
    expect(url.pathname).toBe(`/assistant/${NEEVAI_AGENT_ID}`);
    expect(url.searchParams.get("q")).toBe("How do I fund a test account?");
    expect(url.searchParams.get("mode")).toBe("fullpage");
    expect(url.searchParams.get("autosend")).toBe("1");
  });

  it("caps the question length", () => {
    const url = new URL(getNeevaiFullPageUrl("a".repeat(500)));

    expect(url.searchParams.get("q")).toHaveLength(
      NEEVAI_MAX_URL_QUESTION_LENGTH,
    );
  });
});
