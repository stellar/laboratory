"use client";

import { useState } from "react";
import { Notification, Card, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { decodeXdr } from "@/helpers/decodeXdr";
import { parseTxXdr } from "@/helpers/parseTxXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";

import { TransactionStepHeader } from "./TransactionStepHeader";
import { CodeEditor } from "@/components/CodeEditor";
import {
  getTxSignatureCompleteness,
  TxSignatureCompleteness,
} from "@/helpers/checkRequiredSignatures";

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
  // Signed XDR first: once a signature lands, the guidance message below has
  // to reflect it. Falls back to the unsigned XDR before anything is signed.
  const xdr = signedXdr || xdrToSign;
  const tx = parseTxXdr(xdr, network.passphrase);

  const message = tx
    ? getContextMessage(getTxSignatureCompleteness(tx)).message
    : null;
  const xdrJsonDecoded = decodeXdr({
    xdrType: "TransactionEnvelope",
    xdrBlob: signedXdr,
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

      {message ? (
        <Text size="sm" as="div">
          {message}
        </Text>
      ) : null}

      <SignTransactionXdr
        id="sign-step"
        xdrToSign={xdrToSign || null}
        onDoneAction={({ signedXdr, errorMessage }) => {
          onSigned(signedXdr ?? "");
          setErrorMessage(errorMessage);
        }}
      />

      {errorMessage ? (
        <Notification variant="error" title="Signing failed">
          {errorMessage}
        </Notification>
      ) : null}

      {signatureContext}

      {signedXdr ? (
        <Card>
          <Box gap="md">
            <Notification variant="success" title="Transaction signed">
              Transaction signed and ready to submit.
            </Notification>

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

const getContextMessage = (
  completeness: TxSignatureCompleteness,
): { message: string } => {
  if (completeness.hasInvalid) {
    return {
      message:
        "This transaction carries invalid signature(s) that won’t be accepted at submission. Review the signatures below before signing.",
    };
  }

  if (completeness.hasUnrecognizedSigners) {
    return {
      message:
        "This step is optional. You can skip this step or add a signature if needed.",
    };
  }

  if (completeness.missingSigners.length > 0) {
    return {
      message: "This transaction needs signature(s).",
    };
  }

  return {
    message:
      "This transaction already has every signature that can be verified offline.",
  };
};
