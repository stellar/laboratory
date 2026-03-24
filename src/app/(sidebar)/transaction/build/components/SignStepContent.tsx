"use client";

import { useState } from "react";
import { Alert, Card, Icon, Link, Text } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";
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
  const { build, simulate, sign, setSignedXdr, resetAll } = useBuildFlowStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

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
        onDoneAction={({ signedXdr, errorMessage }) => {
          setSignedXdr(signedXdr ?? "");
          setErrorMessage(errorMessage);
          setIsAlertDismissed(false);
        }}
      />

      {errorMessage ? (
        <Alert variant="error" placement="inline">
          {errorMessage}
        </Alert>
      ) : null}

      {sign.signedXdr ? (
        <Card>
          <Box gap="md">
            {!isAlertDismissed ? (
              <Alert variant="success" placement="inline">
                Transaction signed and ready to submit.
              </Alert>
            ) : null}

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
                  {sign.signedXdr}
                </Text>
              </div>
            </Box>

            <Box
              gap="xs"
              direction="row"
              align="center"
              justify="end"
              addlClassName="SignStepContent__feeBumpRow"
            >
              <Icon.InfoCircle />
              <Text
                size="sm"
                weight="medium"
                as="div"
                addlClassName="SignStepContent__feeBumpText"
              >
                Want another account to pay the fee?{" "}
              </Text>

              <Link href="/transaction/fee-bump">Wrap with fee bump</Link>
            </Box>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
};
