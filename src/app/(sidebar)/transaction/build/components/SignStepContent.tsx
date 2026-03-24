"use client";

import { useState } from "react";
import { Alert, Link, Text } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { SdsLink } from "@/components/SdsLink";

/**
 * Sign step content for the single-page transaction flow.
 *
 * Wraps `<SignTransactionXdr />` to let users sign the built (or assembled)
 * transaction via secret key, wallet extension, hardware wallet, or raw
 * signature. The signed XDR is stored in the flow store so the page's
 * `isNextDisabled` logic picks it up automatically.
 *
 * @example
 * {activeStep === "sign" && <SignStepContent />}
 */
export const SignStepContent = () => {
  const { build, simulate, sign, setSignedXdr, resetAll } =
    useBuildFlowStore();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use assembled XDR (post-simulation) if available, otherwise the built XDR
  const xdrToSign =
    simulate.assembledXdr || build.soroban.xdr || build.classic.xdr;

  return (
    <Box gap="md">
      <Box gap="md" direction="row" justify="space-between" align="center">
        <PageHeader heading="Sign transaction" as="h1" />

        <Text as="div" size="xs">
          <Link
            variant="primary"
            onClick={() => {
              resetAll();
            }}
          >
            Clear all
          </Link>
        </Text>
      </Box>

      <Text size="sm" as="div">
        To be included in the ledger, the transaction must be signed and
        submitted to the network.
      </Text>

      <SignTransactionXdr
        id="sign-step"
        title="Sign transaction"
        xdrToSign={xdrToSign || null}
        onDoneAction={({ signedXdr, successMessage, errorMessage }) => {
          setSignedXdr(signedXdr ?? "");
          setSuccessMessage(successMessage);
          setErrorMessage(errorMessage);
        }}
      />

      {successMessage && sign.signedXdr ? (
        <Alert variant="success" placement="inline">
          {successMessage}. Transaction signed and ready to submit.
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="error" placement="inline">
          {errorMessage}
        </Alert>
      ) : null}

      {sign.signedXdr ? (
        <Box gap="sm">
          <XdrPicker
            id="signed-tx-xdr"
            label="Signed transaction (Base64 XDR)"
            value={sign.signedXdr}
            readOnly
          />

          <Box gap="xs" direction="row" align="center" justify="center">
            <Text size="xs" as="div">
              Want another account to pay the fee?
            </Text>
            <SdsLink href="/transaction/fee-bump">
              Wrap with fee bump
            </SdsLink>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
