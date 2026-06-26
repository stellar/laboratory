"use client";

import { useState } from "react";
import { Button, Notification, Text, Textarea } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/Tabs";
import { SignMessage } from "@/components/SignMessage";
import { VerifyMessage, VerifyResult } from "@/components/VerifyMessage";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { SignedMessage } from "@/helpers/messageHelper";

type ActiveTab = "sign" | "verify";

const TABS = [
  { id: "sign", label: "Sign" },
  { id: "verify", label: "Verify" },
];

export default function SignMessagePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sign");
  const [message, setMessage] = useState("");
  const [signedResult, setSignedResult] = useState<SignedMessage | null>(null);
  const [prefillSignedResult, setPrefillSignedResult] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyResult>(null);

  return (
    <Box gap="md">
      <PageHeader heading="Sign message" />

      <Text size="sm" as="div">
        Sign an arbitrary message to authenticate and confirm your ownership of
        an address.
      </Text>

      <Tabs
        tabs={TABS}
        activeTabId={activeTab}
        onChange={(id) => {
          setActiveTab(id as ActiveTab);
          setPrefillSignedResult(false);
          setVerifyResult(null);
        }}
      />

      {activeTab === "sign" ? (
        <Box gap="lg">
          <PageCard>
            <Box gap="md">
              <Textarea
                id="sign-message-input"
                fieldSize="md"
                label="Message"
                value={message}
                placeholder="Enter a message to sign"
                rows={5}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setSignedResult(null);
                }}
              />

              <SignMessage
                id="sign-message"
                message={message}
                isDisabled={!message}
                onSigned={setSignedResult}
              />
            </Box>
          </PageCard>

          {signedResult ? (
            <>
              <ValidationResponseCard
                variant="success"
                title="Message signed"
                response={
                  <Box gap="lg">
                    <TxResponse
                      label="Signer public key:"
                      value={signedResult.publicKey}
                    />

                    <TxResponse label="Message:" value={signedResult.message} />

                    <TxResponse
                      label="Signature (base64):"
                      value={signedResult.signature}
                    />
                  </Box>
                }
                footerLeftEl={
                  <Button
                    size="md"
                    variant="tertiary"
                    onClick={() => {
                      setActiveTab("verify");
                      setPrefillSignedResult(true);
                    }}
                  >
                    Verify
                  </Button>
                }
              />
            </>
          ) : null}
        </Box>
      ) : (
        <>
          <PageCard>
            <Box gap="md">
              <Text size="sm" as="div">
                Confirm that the holder of a public key signed a given message.
                Paste the signer’s public key, the original message, and the
                signature.
              </Text>

              <VerifyMessage
                prefill={
                  prefillSignedResult && signedResult ? signedResult : null
                }
                onVerify={setVerifyResult}
              />
            </Box>
          </PageCard>
          {verifyResult ? (
            <Notification
              variant={verifyResult.isValid ? "success" : "error"}
              title={
                verifyResult.isValid
                  ? "Signature is valid"
                  : "Signature is invalid"
              }
            >
              {verifyResult.isValid
                ? `Signed by ${shortenStellarAddress(verifyResult.publicKey)} for this message.`
                : `This signature was not produced by ${shortenStellarAddress(
                    verifyResult.publicKey,
                  )} for this message.`}
            </Notification>
          ) : null}
        </>
      )}
    </Box>
  );
}
