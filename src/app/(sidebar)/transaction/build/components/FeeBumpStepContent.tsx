"use client";

import { useEffect, useState } from "react";
import { Alert, Card, Link, Text } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { txHelper } from "@/helpers/txHelper";
import { removeLeadingZeroes } from "@/helpers/removeLeadingZeroes";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { PubKeyPickerWithSignerSelector } from "@/components/FormElements/PubKeyPickerWithSignerSelector";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";

/**
 * Fee bump step content for the single-page transaction flow.
 *
 * Wraps the signed inner transaction in a fee bump envelope, then lets the
 * user sign the envelope with the fee-paying account's key. The signed fee
 * bump XDR is stored in the flow store so the submit step picks it up.
 *
 * @param onCancel - Callback to cancel the fee bump and return to the
 *   previous step (disables fee bump and navigates back).
 *
 * @example
 * {activeStep === "fee-bump" && <FeeBumpStepContent onCancel={handleCancel} />}
 */
export const FeeBumpStepContent = ({ onCancel }: { onCancel: () => void }) => {
  const { network } = useStore();
  const {
    sign,
    validate: validateState,
    feeBump,
    setFeeBumpParams,
    setFeeBumpSignedXdr,
  } = useBuildFlowStore();

  const [sourceAccountError, setSourceAccountError] = useState<
    string | undefined
  >();
  const [feeError, setFeeError] = useState<string | undefined>();
  const [buildError, setBuildError] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  // The inner transaction XDR to wrap (validated > signed)
  const innerXdr = validateState?.validatedXdr || sign.signedXdr;

  // The unsigned fee bump envelope, built on-the-fly
  const [feeBumpXdr, setFeeBumpXdr] = useState<string>("");

  // Build fee bump whenever inputs change
  useEffect(() => {
    setBuildError(null);
    setFeeBumpXdr("");

    if (!innerXdr || !feeBump.source_account || !feeBump.fee) {
      return;
    }

    const pubKeyError = validate.getPublicKeyError(feeBump.source_account);
    const feeErr = validate.getPositiveIntError(feeBump.fee);

    if (pubKeyError || feeErr) {
      return;
    }

    const result = txHelper.buildFeeBumpTx({
      innerTxXdr: innerXdr,
      maxFee: feeBump.fee,
      sourceAccount: feeBump.source_account,
      networkPassphrase: network.passphrase,
    });

    if (result.errors.length > 0) {
      setBuildError(result.errors.join(". "));
    } else {
      setFeeBumpXdr(result.xdr);
    }
  }, [innerXdr, feeBump.source_account, feeBump.fee, network.passphrase]);

  // Clear the signed fee bump XDR when the unsigned envelope changes
  useEffect(() => {
    setFeeBumpSignedXdr("");
    setSignError(null);
  }, [feeBumpXdr, setFeeBumpSignedXdr]);

  return (
    <Box gap="md">
      <Box gap="md" direction="row" justify="space-between" align="center">
        <PageHeader heading="Wrap with fee bump" />

        <Link variant="primary" onClick={onCancel} size="xs">
          Cancel fee bump
        </Link>
      </Box>

      <PageCard>
        <Box gap="lg">
          <PubKeyPickerWithSignerSelector
            id="fee-bump-source-account"
            label="Fee-paying account"
            value={feeBump.source_account}
            error={sourceAccountError}
            onChange={(val) => {
              setSourceAccountError(
                val ? validate.getPublicKeyError(val) || undefined : undefined,
              );
              setFeeBumpParams({ source_account: val });
            }}
          />

          <PositiveIntPicker
            id="fee-bump-fee"
            label="Base fee"
            value={removeLeadingZeroes(feeBump.fee)}
            error={feeError}
            onChange={(e) => {
              const val = e.target.value;
              setFeeError(
                val
                  ? validate.getPositiveIntError(val) || undefined
                  : undefined,
              );
              setFeeBumpParams({ fee: val });
            }}
            note={
              <>Base inclusion fee for fee bump transaction is 200 stroops.</>
            }
            infoLink="https://developers.stellar.org/docs/learn/glossary#base-fee"
          />
        </Box>
      </PageCard>

      {buildError ? (
        <Alert variant="error" placement="inline" title="Fee bump error">
          {buildError}
        </Alert>
      ) : null}

      {feeBumpXdr ? (
        <PageCard>
          <Box gap="lg">
            <Text size="sm" as="div">
              Sign the fee bump envelope with the fee-paying account&apos;s key.
            </Text>

            <SignTransactionXdr
              id="fee-bump-sign"
              xdrToSign={feeBumpXdr}
              onDoneAction={({ signedXdr, errorMessage }) => {
                setFeeBumpSignedXdr(signedXdr ?? "");
                setSignError(errorMessage);
              }}
            />

            {signError ? (
              <Alert variant="error" placement="inline">
                {signError}
              </Alert>
            ) : null}

            {feeBump.signedXdr ? (
              <Card>
                <Box gap="md">
                  <Alert variant="success" placement="inline">
                    Fee bump transaction signed and ready to submit.
                  </Alert>

                  <Box gap="xs">
                    <Text
                      size="xs"
                      weight="medium"
                      as="div"
                      addlClassName="SignStepContent__label"
                    >
                      Signed fee bump transaction (Base64 XDR)
                    </Text>
                    <div className="SignStepContent__xdrBox">
                      <Text
                        size="sm"
                        as="div"
                        addlClassName="SignStepContent__xdrText"
                      >
                        {feeBump.signedXdr}
                      </Text>
                    </div>
                  </Box>
                </Box>
              </Card>
            ) : null}
          </Box>
        </PageCard>
      ) : null}
    </Box>
  );
};
