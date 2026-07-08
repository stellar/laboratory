"use client";

import { useState } from "react";
import { Alert, Card, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { decodeXdr } from "@/helpers/decodeXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";

import { TransactionStepHeader } from "./TransactionStepHeader";
import { CodeEditor } from "@/components/CodeEditor";

type Props = {
  xdrToSign: string;
  signedXdr: string;
  onSigned: (signedXdr: string) => void;
  onClearAll: () => void;
  /**
   * Optional slot rendered above the signing UI — the import flow passes a
   * signature-status panel here so a co-signer can review existing signatures
   * before adding their own. Omitted by the build flow.
   */
  signatureContext?: React.ReactNode;
};

/**
 * Sign step content for the single-page transaction flow.
 *
 * Wraps `<SignTransactionXdr />` to let users sign the built (or assembled)
 * transaction via secret key, wallet extension, hardware wallet, or raw
 * signature. Flow-agnostic: the parent flow (build or import) reads its own
 * store, derives `xdrToSign`, and persists the signed XDR via `onSigned`.
 *
 * @example
 * {activeStep === "sign" && (
 *   <SignStepContent
 *     xdrToSign={simulate.assembledXdr || build.soroban.xdr || build.classic.xdr}
 *     signedXdr={sign.signedXdr}
 *     onSigned={setSignedXdr}
 *     onClearAll={resetAll}
 *   />
 * )}
 */
export const SignStepContent = ({
  xdrToSign,
  signedXdr,
  onSigned,
  onClearAll,
  signatureContext,
}: Props) => {
  const { network } = useStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"json" | "xdr">(
    "json",
  );

  const isXdrInit = useIsXdrInit();

  const xdrJsonDecoded = decodeXdr({
    xdrType: "TransactionEnvelope",
    xdrBlob: xdrToSign,
    isReady: isXdrInit,
  });

  const signedXdrJsonString = xdrJsonDecoded?.jsonString
    ? `${prettifyJsonString(xdrJsonDecoded.jsonString)}\n`
    : "";

  return (
    <Box gap="md">
      <TransactionStepHeader
        heading="Sign transaction"
        onClearAll={onClearAll}
        xdr={xdrToSign}
      />

      <Text size="sm" as="div">
        To be included in the ledger, the transaction must be signed and
        submitted to the network.
      </Text>

      {signatureContext}

      <SignTransactionXdr
        id="sign-step"
        xdrToSign={xdrToSign || null}
        onDoneAction={({ signedXdr, errorMessage }) => {
          onSigned(signedXdr ?? "");
          setErrorMessage(errorMessage);
        }}
      />

      {errorMessage ? (
        <Alert variant="error" placement="inline">
          {errorMessage}
        </Alert>
      ) : null}

      {signedXdr ? (
        <Card>
          <Box gap="md">
            <Alert variant="success" placement="inline">
              Transaction signed and ready to submit.
            </Alert>

            <Box gap="xxl">
              <Box gap="lg">
                <TransactionHashReadOnlyField
                  xdr={signedXdr}
                  networkPassphrase={network.passphrase}
                />

                {signedXdrJsonString ? (
                  <CodeEditor
                    title="Signed transaction"
                    value={
                      selectedLanguage === "json"
                        ? signedXdrJsonString
                        : signedXdr
                    }
                    languages={["json", "xdr"]}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={(id) => {
                      const selectedValue = id === "xdr" ? "xdr" : "json";
                      setSelectedLanguage(selectedValue);
                    }}
                    maxHeightInRem="20"
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
};
