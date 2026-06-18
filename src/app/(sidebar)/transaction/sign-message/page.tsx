"use client";

import { useState } from "react";
import { Input, Text, Textarea } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/Tabs";
import { SignMessage } from "@/components/SignMessage";
import { VerifyMessage } from "@/components/VerifyMessage";

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

  return (
    <Box gap="md">
      <PageHeader heading="Sign message" />

      <Text size="sm" as="div">
        Sign an arbitrary message to authenticate and confirm your ownership of
        an address, or verify a signature. This is an off-chain proof — no
        transaction is created or submitted.
      </Text>

      <Tabs
        tabs={TABS}
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id as ActiveTab)}
      />

      {activeTab === "sign" ? (
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

            {signedResult ? (
              <Box gap="sm">
                <Input
                  id="sign-message-result-public-key"
                  fieldSize="md"
                  label="Signer public key"
                  value={signedResult.publicKey}
                  readOnly
                  copyButton={{ position: "right" }}
                />
                <Textarea
                  id="sign-message-result-message"
                  fieldSize="md"
                  label="Message"
                  value={signedResult.message}
                  rows={3}
                  readOnly
                />
                <Textarea
                  id="sign-message-result-signature"
                  fieldSize="md"
                  label="Signature (base64)"
                  value={signedResult.signature}
                  rows={2}
                  readOnly
                  hasCopyButton
                />
              </Box>
            ) : null}
          </Box>
        </PageCard>
      ) : (
        <PageCard>
          <Box gap="md">
            <Text size="sm" as="div">
              Confirm that the holder of a public key signed a given message.
              Paste the signer’s public key, the original message, and the
              signature.
            </Text>

            <VerifyMessage prefill={signedResult} />
          </Box>
        </PageCard>
      )}
    </Box>
  );
}
