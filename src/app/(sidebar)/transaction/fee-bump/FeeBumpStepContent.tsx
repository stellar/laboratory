"use client";

import { useEffect, useState } from "react";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { Alert, Text } from "@stellar/design-system";
import { get, omit, set } from "lodash";

import { FeeBumpParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { sanitizeObject } from "@/helpers/sanitizeObject";
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

import { KeysOfUnion } from "@/types/types";

import { OperationNamesFromXdr } from "./OperationNamesFromXdr";

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
interface FeeBumpStepContentProps {
  onBuilt?: (xdr: string) => void;
  onReset?: () => void;
}

export const FeeBumpStepContent = ({
  onBuilt,
  onReset,
}: FeeBumpStepContentProps) => {
  const { network, transaction } = useStore();

  const { feeBump, updateFeeBumpParams } = transaction;
  const { source_account, fee, innerXdr } = feeBump;

  const [feeBumpedTx, setFeeBumpedTx] = useState<FeeBumpedTxResponse>({
    errors: [],
    xdr: "",
  });
  const [sourceAccountError, setSourceAccountError] = useState<
    string | undefined
  >();
  const [feeError, setFeeError] = useState<string | undefined>();
  const [buildError, setBuildError] = useState<string | null>(null);

  type ParamsField = KeysOfUnion<typeof feeBump>;
  type ParamsError = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [K in keyof FeeBumpParams]?: any;
  };

  const [paramsError, setParamsError] = useState<ParamsError>({});

  useEffect(() => {
    Object.entries(feeBump).forEach(([key, val]) => {
      if (val) {
        handleParamsError(key, validateParam(key as ParamsField, val));
      }
    });

    // Run this only when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build fee bump whenever inputs change
  useEffect(() => {
    setBuildError(null);

    if (!fee || !source_account || !innerXdr) {
      setFeeBumpedTx({ errors: [], xdr: "" });
      onBuilt?.("");
      return;
    }

    const pubKeyError = validate.getPublicKeyError(source_account);
    const feeErr = validate.getPositiveIntError(fee);

    if (pubKeyError || feeErr) {
      return;
    }

    const rawResult = txHelper.buildFeeBumpTx({
      innerTxXdr: innerXdr,
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
      onBuilt?.("");
    } else {
      setFeeBumpedTx(result);
      onBuilt?.(result.xdr);
    }
  }, [innerXdr, source_account, fee, network.passphrase]);

  const handleParamsError = <T,>(id: string, error: T) => {
    if (error) {
      setParamsError(set({ ...paramsError }, id, error));
    } else if (get(paramsError, id)) {
      setParamsError(sanitizeObject(omit({ ...paramsError }, id), true));
    }
  };

  const validateParam = (param: ParamsField, value: any) => {
    switch (param) {
      case "source_account":
        return validate.getPublicKeyError(value);
      case "fee":
        return validate.getPositiveIntError(value);
      case "innerXdr":
        if (validate.getXdrError(value)?.result === "success") {
          return false;
        }
        return validate.getXdrError(value)?.message;
      default:
        return false;
    }
  };

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
            value={innerXdr}
            note="Enter a Base64 encoded XDR blob to decode."
            onChange={(e) => {
              const val = e.target.value;
              updateFeeBumpParams({ innerXdr: val });
            }}
          />

          <OperationNamesFromXdr
            xdr={innerXdr}
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
              updateFeeBumpParams({ source_account: val });
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
              updateFeeBumpParams({ fee: val });
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
