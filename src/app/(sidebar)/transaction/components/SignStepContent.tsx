"use client";

import { useState } from "react";
import { Alert, Card, Text } from "@stellar/design-system";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";

import { TransactionStepHeader } from "./TransactionStepHeader";

type Props = {
  xdrToSign: string;
  signedXdr: string;
  onSigned: (signedXdr: string) => void;
  onClearAll: () => void;
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
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
              <Box gap="xs">
                <Text
                  size="xs"
                  weight="medium"
                  as="div"
                  addlClassName="SignStepContent__label"
                >
                  Signed transaction (Base64 XDR)
                </Text>

                <div className="SignStepContent__xdrBox">
                  <Text
                    size="sm"
                    as="div"
                    addlClassName="SignStepContent__xdrText"
                  >
                    {signedXdr}
                  </Text>
                </div>
              </Box>
            </Box>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
};
