"use client";

import { useEffect, useState } from "react";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { Alert, Text } from "@stellar/design-system";
import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { FeeBumpedTxResponse, txHelper } from "@/helpers/txHelper";
import { removeLeadingZeroes } from "@/helpers/removeLeadingZeroes";

import { PubKeyPickerWithSignerSelector } from "@/components/FormElements/PubKeyPickerWithSignerSelector";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";
import { TransactionFlowHeader } from "@/components/TransactionFlowHeader";
import { SdsLink } from "@/components/SdsLink";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { OperationNamesFromXdr } from "./OperationNamesFromXdr";

/**
 * Fee bump step content for the fee bump flow.
 *
 * Collects the inner transaction XDR, fee-paying account, and base fee, then
 * builds the fee bump envelope. The resulting XDR is passed to the parent via
 * `onBuiltXdr` so the sign step can pick it up.
 *
 * @param onBuiltXdr - Called with the built fee bump XDR, or an empty string
 *   when inputs are incomplete or invalid.
 * @param onReset - Callback to reset the entire flow.
 * @param onParamsChange - Called on any input change; used by the parent to
 *   invalidate downstream stepper state (sign/submit).
 */
interface FeeBumpStepContentProps {
  onBuiltXdr?: (xdr: string) => void;
  onReset?: () => void;
  onParamsChange?: () => void;
}

export const FeeBumpStepContent = ({
  onBuiltXdr,
  onReset,
  onParamsChange,
}: FeeBumpStepContentProps) => {
  const { network, transaction } = useStore();
  const { feeBump, updateFeeBumpParams } = transaction;
  const { source_account, fee, xdr } = feeBump;

  const [feeBumpedTx, setFeeBumpedTx] = useState<FeeBumpedTxResponse>({
    errors: [],
    xdr: "",
  });
  const [sourceAccountError, setSourceAccountError] = useState<
    string | undefined
  >(source_account ? validate.getPublicKeyError(source_account) || undefined : undefined);
  const [feeError, setFeeError] = useState<string | undefined>(
    fee ? validate.getPositiveIntError(fee) || undefined : undefined,
  );
  const [buildError, setBuildError] = useState<string | null>(null);

  // Build fee bump whenever inputs change
  useEffect(() => {
    setBuildError(null);

    if (!fee || !source_account || !xdr) {
      setFeeBumpedTx({ errors: [], xdr: "" });
      onBuiltXdr?.("");
      return;
    }

    const pubKeyError = validate.getPublicKeyError(source_account);
    const feeErr = validate.getPositiveIntError(fee);

    if (pubKeyError || feeErr) {
      setFeeBumpedTx({ errors: [], xdr: "" });
      onBuiltXdr?.("");
      return;
    }

    const rawResult = txHelper.buildFeeBumpTx({
      innerTxXdr: xdr,
      maxFee: fee,
      sourceAccount: source_account,
      networkPassphrase: network.passphrase,
    });

    const result: FeeBumpedTxResponse =
      rawResult && Array.isArray(rawResult.errors)
        ? rawResult
        : { errors: ["Failed to build fee bump transaction."], xdr: "" };

    if (result.errors.length > 0) {
      setBuildError(result.errors.join(". "));
      onBuiltXdr?.("");
    } else {
      setFeeBumpedTx(result);
      onBuiltXdr?.(result.xdr);
    }
  }, [xdr, source_account, fee, network.passphrase]);

  const getHashAndNetwork = (): {
    hash: string;
    networkPassphrase: string;
  } | null => {
    if (!feeBumpedTx?.xdr) {
      return null;
    }

    try {
      const txnHash = TransactionBuilder.fromXDR(
        feeBumpedTx.xdr,
        network.passphrase,
      )
        .hash()
        .toString("hex");

      return { hash: txnHash, networkPassphrase: network.passphrase };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  };

  return (
    <Box gap="lg">
      <Box gap="xs">
        <TransactionFlowHeader
          heading="Fee bump transaction"
          onClearAll={() => {
            onReset?.();
          }}
        />
        <Text size="sm" as="p">
          Fee bump lets another account pay or raise fees without modifying or
          re-signing the transaction.
        </Text>
      </Box>
      <PageCard>
        <Box gap="xl">
          <XdrPicker
            id="view-xdr-blob"
            label="Base64 encoded XDR"
            value={xdr}
            note="Enter a Base64 encoded XDR blob to decode."
            onChange={(e) => {
              const val = e.target.value;
              updateFeeBumpParams({ xdr: val, signedTx: "" });
              onParamsChange?.();
            }}
          />
          <OperationNamesFromXdr
            xdr={xdr}
            networkPassphrase={network.passphrase}
          />
        </Box>
      </PageCard>

      <PageCard>
        <Box gap="md">
          <PubKeyPickerWithSignerSelector
            id="fee-bump-source-account"
            label="Fee-paying account"
            value={feeBump.source_account}
            error={sourceAccountError}
            onChange={(val) => {
              setSourceAccountError(
                val ? validate.getPublicKeyError(val) || undefined : undefined,
              );
              updateFeeBumpParams({ source_account: val, signedTx: "" });
              onParamsChange?.();
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
              updateFeeBumpParams({ fee: val, signedTx: "" });
              onParamsChange?.();
            }}
            note={
              <>
                The{" "}
                <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering">
                  network base fee
                </SdsLink>{" "}
                is currently set to 100 stroops (0.00001 lumens). Based on
                current network activity, we suggest setting it to 100 stroops.
                Final transaction fee is equal to base fee times number of
                operations in this transaction.
              </>
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

      {!buildError && feeBumpedTx?.xdr ? (
        <ValidationResponseCard
          variant="success"
          title="Success! Transaction envelope XDR:"
          response={(() => {
            const hashAndNetwork = getHashAndNetwork();

            return (
              <Box gap="xs" data-testid="fee-bump-success">
                <TxResponse
                  label="Network passphrase:"
                  value={network.passphrase}
                />
                <TxResponse
                  label="Hash:"
                  value={hashAndNetwork?.hash || "Error decoding XDR"}
                />
                <TxResponse label="XDR:" value={feeBumpedTx.xdr} />
              </Box>
            );
          })()}
          footerLeftEl={<></>}
          footerRightEl={
            <>
              <ViewInXdrButton
                xdrBlob={feeBumpedTx.xdr}
                callback={() => {
                  trackEvent(TrackingEvent.TRANSACTION_FEE_BUMP_VIEW_XDR);
                }}
              />
            </>
          }
        />
      ) : null}
    </Box>
  );
};
