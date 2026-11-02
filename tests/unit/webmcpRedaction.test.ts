import { Keypair } from "@stellar/stellar-sdk";

import { redactSecrets, toolResult } from "../../src/webmcp/toolResult";
import { getCurrentView } from "../../src/webmcp/currentView";
import { Store } from "../../src/store/createStore";

const secret = Keypair.random().secret();
const publicKey = Keypair.fromSecret(secret).publicKey();

describe("WebMCP tool output never contains secret keys", () => {
  it("masks secret seeds inside strings", () => {
    const text = toolResult({ note: `key is ${secret} ok` }).content[0].text;

    expect(text).not.toContain(secret);
    expect(text).toContain("[redacted secret key]");
  });

  it("drops sensitive fields by name", () => {
    expect(
      redactSecrets({
        publicKey,
        secretKey: "anything",
        recoveryPhrase: "word word word",
        rpcHeaderValue: "api-key",
        nested: [{ seed: "x", ok: 1 }],
      }),
    ).toEqual({ publicKey, nested: [{ ok: 1 }] });
  });

  it("current view on the account page shares only the public key", () => {
    const state = {
      network: {},
      account: {
        publicKey,
        secretKey: secret,
        recoveryPhrase: "abandon abandon abandon",
        generatedMuxedAccount: {},
        parsedMuxedAccount: {},
      },
    } as unknown as Store;

    const text = toolResult(getCurrentView(state, "/account/create")).content[0]
      .text;

    expect(text).toContain(publicKey);
    expect(text).not.toContain(secret);
    expect(text).not.toContain("abandon");
  });
});
