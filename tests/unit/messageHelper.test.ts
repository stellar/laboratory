// Jest globals (describe, expect, it) are available globally
import { Keypair } from "@stellar/stellar-sdk";

import {
  signMessageWithSecretKey,
  verifyMessage,
  SEP53_PREFIX,
} from "../../src/helpers/messageHelper";

const kp = Keypair.random();
const SECRET = kp.secret();

describe("SEP-53 messageHelper", () => {
  it("signs a message and round-trips through verify", () => {
    const { publicKey, message, signature } = signMessageWithSecretKey({
      secretKey: SECRET,
      message: "Hello, Stellar!",
    });

    expect(publicKey).toBe(kp.publicKey());
    expect(message).toBe("Hello, Stellar!");
    // 64-byte ed25519 signature, base64-encoded.
    expect(Buffer.from(signature, "base64")).toHaveLength(64);

    expect(
      verifyMessage({ publicKey, message: "Hello, Stellar!", signature }),
    ).toBe(true);
  });

  it("applies the SEP-53 prefix (raw-message signature does not verify)", () => {
    const message = "prove ownership";
    const { signature } = signMessageWithSecretKey({ secretKey: SECRET, message });

    // A signature over the prefixed payload must NOT verify against an
    // unprefixed message, confirming the prefix is part of the signed payload.
    const unprefixedHash = kp.sign(Buffer.from(message, "utf8"));
    expect(unprefixedHash.toString("base64")).not.toBe(signature);
  });

  it("fails verification for a tampered message", () => {
    const { publicKey, signature } = signMessageWithSecretKey({
      secretKey: SECRET,
      message: "original",
    });

    expect(
      verifyMessage({ publicKey, message: "tampered", signature }),
    ).toBe(false);
  });

  it("fails verification for a different signer", () => {
    const { message, signature } = signMessageWithSecretKey({
      secretKey: SECRET,
      message: "whose key?",
    });

    const other = Keypair.random();
    expect(
      verifyMessage({ publicKey: other.publicKey(), message, signature }),
    ).toBe(false);
  });

  it("exposes the canonical prefix", () => {
    expect(SEP53_PREFIX).toBe("Stellar Signed Message:\n");
  });
});
