"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { verifyMessage, SignedMessage } from "@/helpers/messageHelper";
import { validate } from "@/validate";

export type VerifyResult = { isValid: boolean; publicKey: string } | null;

/**
 * Verify a SEP-53 message signature: given a signer public key, the original
 * message, and the base64 signature, confirm whether the holder of that key
 * signed that exact message. Pure local computation — no network involved.
 *
 * `prefill` populates the fields from a freshly signed message so a user can
 * round-trip their own signature; the fields stay editable for verifying
 * someone else's.
 */
export const VerifyMessage = ({
  prefill,
  onVerify,
}: {
  prefill?: SignedMessage | null;
  onVerify: (result: VerifyResult) => void;
}) => {
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (prefill) {
      setPublicKey(prefill.publicKey);
      setMessage(prefill.message);
      setSignature(prefill.signature);
      onVerify?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const publicKeyError = publicKey
    ? validate.getPublicKeyError(publicKey)
    : false;
  const signatureError = signature
    ? validate.getMessageSignatureError(signature)
    : false;

  const canVerify =
    Boolean(publicKey) &&
    Boolean(message) &&
    Boolean(signature) &&
    !publicKeyError &&
    !signatureError;

  const handleVerify = () => {
    try {
      const isValid = verifyMessage({ publicKey, message, signature });
      onVerify?.({ isValid, publicKey });
    } catch {
      onVerify?.({ isValid: false, publicKey });
    }
  };

  return (
    <Box gap="md">
      <Input
        id="verify-message-public-key"
        fieldSize="md"
        label="Signer public key"
        placeholder="G…"
        value={publicKey}
        error={publicKeyError || undefined}
        onChange={(e) => {
          setPublicKey(e.target.value);
          if (publicKey) {
            onVerify?.(null);
          }
        }}
      />

      <Textarea
        id="verify-message-message"
        fieldSize="md"
        label="Message"
        placeholder="The original message that was signed"
        rows={3}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (message) {
            onVerify?.(null);
          }
        }}
      />

      <Textarea
        id="verify-message-signature"
        fieldSize="md"
        label="Signature (base64)"
        placeholder="Base64-encoded signature"
        rows={2}
        value={signature}
        error={signatureError || undefined}
        onChange={(e) => {
          setSignature(e.target.value);
          if (signature) {
            onVerify?.(null);
          }
        }}
      />

      <Box gap="md" direction="row" align="center" wrap="wrap">
        <Button
          size="md"
          variant="secondary"
          disabled={!canVerify}
          onClick={handleVerify}
        >
          Verify
        </Button>
      </Box>
    </Box>
  );
};
