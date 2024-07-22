"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Icon } from "@stellar/design-system";
import { MemoValue } from "@stellar/stellar-sdk";
import { get, omit, set } from "lodash";

import { Box } from "@/components/layout/Box";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { SdsLink } from "@/components/SdsLink";
import { Routes } from "@/constants/routes";
import { InputSideElement } from "@/components/InputSideElement";
import {
  MemoPicker,
  MemoPickerValue,
} from "@/components/FormElements/MemoPicker";
import { TimeBoundsPicker } from "@/components/FormElements/TimeBoundsPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { validate } from "@/validate";
import { EmptyObj, KeysOfUnion } from "@/types/types";

export const Params = () => {
  const requiredParams = ["source_account", "seq_num", "fee"] as const;

  const { transaction, network } = useStore();
  const { params: txnParams } = transaction.build;
  const {
    updateBuildActiveTab,
    updateBuildParams,
    updateBuildIsValid,
    resetBuildParams,
  } = transaction;

  const [paramsError, setParamsError] = useState<ParamsError>({});

  // Types
  type RequiredParamsField = (typeof requiredParams)[number];

  type ParamsField = KeysOfUnion<typeof txnParams>;

  type ParamsError = {
    [K in keyof TransactionBuildParams]?: any;
  };

  const {
    data: sequenceNumberData,
    error: sequenceNumberError,
    dataUpdatedAt: sequenceNumberDataUpdatedAt,
    errorUpdatedAt: sequenceNumberErrorUpdatedAt,
    refetch: fetchSequenceNumber,
    isFetching: isFetchingSequenceNumber,
    isLoading: isLoadingSequenceNumber,
  } = useAccountSequenceNumber({
    publicKey: txnParams.source_account,
    horizonUrl: network.horizonUrl,
  });

  // Preserve values and validate inputs when components mounts
  useEffect(() => {
    Object.entries(txnParams).forEach(([key, val]) => {
      if (val) {
        validateParam(key as ParamsField, val);
      }
    });

    const validationError = Object.entries(txnParams).reduce((res, param) => {
      const key = param[0] as ParamsField;
      const val = param[1];

      if (val) {
        const error = validateParam(key, val);

        if (error) {
          res[key] = key === "cond" ? { time: error } : error;
        }
      }

      return res;
    }, {} as ParamsError);

    if (!isEmptyObject(validationError)) {
      setParamsError(validationError);
    }
    // Run this only when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle fetch sequence number response
  useEffect(() => {
    if (sequenceNumberData || sequenceNumberError) {
      const id = "seq_num";

      handleParamChange(id, sequenceNumberData);
      handleParamsError(id, sequenceNumberError);
    }
    // Not inlcuding handleParamChange and handleParamsError
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sequenceNumberData,
    sequenceNumberError,
    sequenceNumberDataUpdatedAt,
    sequenceNumberErrorUpdatedAt,
  ]);

  const handleParamChange = <T,>(paramPath: string, value: T) => {
    updateBuildParams(set({}, `${paramPath}`, value));
  };

  const handleParamsError = <T,>(id: string, error: T) => {
    if (error) {
      setParamsError(set({ ...paramsError }, id, error));
    } else if (get(paramsError, id)) {
      setParamsError(sanitizeObject(omit({ ...paramsError }, id), true));
    }
  };

  const validateParam = (param: ParamsField, value: any) => {
    switch (param) {
      case "cond":
        return validate.getTimeBoundsError(value?.time || value);
      case "fee":
        return validate.getPositiveIntError(value);
      case "memo":
        if (!value || isEmptyObject(value)) {
          return false;
        }

        // Memo in store is in transaction format { memoType: memoValue }
        if (value.type) {
          return validate.getMemoError(value);
        } else {
          // Changing it to { type, value } format if needed
          const [type, val] = Object.entries(value)[0];
          return validate.getMemoError({ type, value: val as MemoValue });
        }

      case "seq_num":
        return validate.getPositiveIntError(value);
      case "source_account":
        return validate.getPublicKeyError(value);
      default:
        return false;
    }
  };

  const getMemoPickerValue = () => {
    return typeof txnParams.memo === "string"
      ? { type: txnParams.memo, value: "" }
      : {
          type: Object.keys(txnParams.memo)[0],
          value: Object.values(txnParams.memo)[0],
        };
  };

  const getMemoValue = (memo?: MemoPickerValue) => {
    if (!memo?.type) {
      return {} as EmptyObj;
    }

    if (memo.type === "none") {
      return "none";
    }

    return { [memo.type]: memo.value };
  };

  const missingRequiredParams = () => {
    return requiredParams.reduce((res, req) => {
      if (!txnParams[req]) {
        return [...res, req];
      }

      return res;
    }, [] as RequiredParamsField[]);
  };

  const getFieldLabel = (field: ParamsField) => {
    switch (field) {
      case "fee":
        return "Base Fee";
      case "seq_num":
        return "Transaction Sequence Number";
      case "source_account":
        return "Source Account";
      case "cond":
        return "Time Bounds";
      case "memo":
        return "Memo";
      default:
        return "";
    }
  };

  const getParamsError = () => {
    const allErrorMessages: string[] = [];
    const errors = Object.keys(paramsError);

    // Make sure we don't show multiple errors for the same field
    const missingParams = missingRequiredParams().filter(
      (m) => !errors.includes(m),
    );

    // Missing params
    if (missingParams.length > 0) {
      const missingParamsMsg = missingParams.reduce((res, cur) => {
        return [...res, `${getFieldLabel(cur)} is a required field`];
      }, [] as string[]);

      allErrorMessages.push(...missingParamsMsg);
    }

    // Memo value
    const memoValue = txnParams.memo;

    if (
      typeof memoValue === "object" &&
      !isEmptyObject(memoValue) &&
      !Object.values(memoValue)[0]
    ) {
      allErrorMessages.push(
        "Memo value is required when memo type is selected",
      );
    }

    // Fields with errors
    if (!isEmptyObject(paramsError)) {
      const fieldErrors = errors.reduce((res, cur) => {
        return [
          ...res,
          `${getFieldLabel(cur as ParamsField)} field has an error`,
        ];
      }, [] as string[]);

      allErrorMessages.push(...fieldErrors);
    }

    // Callback to the parent component
    updateBuildIsValid({ params: allErrorMessages.length === 0 });

    return allErrorMessages;
  };

  const formErrors = getParamsError();

  return (
    <Box gap="md">
      <Card>
        <Box gap="lg">
          <PubKeyPicker
            id="source_account"
            label="Source Account"
            value={txnParams.source_account}
            error={paramsError.source_account}
            onChange={(e) => {
              const id = "source_account";
              handleParamChange(id, e.target.value);
              handleParamsError(id, validateParam(id, e.target.value));
            }}
            note={
              <>
                If you don’t have an account yet, you can create and fund a test
                net account with the{" "}
                <SdsLink href={Routes.ACCOUNT_CREATE}>account creator</SdsLink>.
              </>
            }
            infoLink="https://developers.stellar.org/docs/learn/glossary#source-account"
          />

          <PositiveIntPicker
            id="seq_num"
            label="Transaction Sequence Number"
            placeholder="Ex: 559234806710273"
            value={txnParams.seq_num}
            error={paramsError.seq_num}
            onChange={(e) => {
              const id = "seq_num";
              handleParamChange(id, e.target.value);
              handleParamsError(id, validateParam(id, e.target.value));
            }}
            note="The transaction sequence number is usually one higher than current account sequence number."
            rightElement={
              <InputSideElement
                variant="button"
                onClick={() => {
                  handleParamChange("seq_num", "");
                  fetchSequenceNumber();
                }}
                placement="right"
                disabled={
                  !txnParams.source_account || paramsError.source_account
                }
                isLoading={isFetchingSequenceNumber || isLoadingSequenceNumber}
              >
                Fetch next sequence
              </InputSideElement>
            }
            infoLink="https://developers.stellar.org/docs/glossary#sequence-number"
          />

          <PositiveIntPicker
            id="fee"
            label="Base Fee"
            value={txnParams.fee}
            error={paramsError.fee}
            onChange={(e) => {
              const id = "fee";
              handleParamChange(id, e.target.value);
              handleParamsError(id, validateParam(id, e.target.value));
            }}
            note={
              <>
                The base inclusion fee is currently set to 100 stroops (0.00001
                lumens). For more real time inclusion fee, please see{" "}
                <SdsLink href="https://developers.stellar.org/docs/data/rpc/api-reference/methods/getFeeStats">
                  getFeeStats
                </SdsLink>{" "}
                from the RPC. To learn more about fees, please see{" "}
                <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering">
                  Fees & Metering
                </SdsLink>
                .
              </>
            }
            infoLink="https://developers.stellar.org/docs/learn/glossary#base-fee"
          />

          <MemoPicker
            id="memo"
            value={getMemoPickerValue()}
            labelSuffix="optional"
            error={paramsError.memo}
            onChange={(_, memo) => {
              const id = "memo";
              handleParamChange(id, getMemoValue(memo));
              handleParamsError(id, validateParam(id, memo));
            }}
            infoLink="https://developers.stellar.org/docs/encyclopedia/memos"
          />

          <TimeBoundsPicker
            id="time"
            value={{
              min_time: txnParams.cond?.time?.min_time,
              max_time: txnParams.cond?.time?.max_time,
            }}
            labelSuffix="optional"
            error={paramsError.cond?.time}
            onChange={(timeBounds) => {
              const id = "cond.time";
              handleParamChange(id, timeBounds);
              handleParamsError(id, validateParam("cond", timeBounds));
            }}
            infoLink="https://developers.stellar.org/docs/learn/glossary#time-bounds"
          />

          <Box gap="md" direction="row" align="center" justify="space-between">
            <Button
              size="md"
              variant="secondary"
              onClick={() => {
                updateBuildActiveTab("operations");
              }}
            >
              Add Operations
            </Button>

            <Button
              size="md"
              variant="error"
              onClick={() => {
                resetBuildParams();
                setParamsError({});
              }}
              icon={<Icon.RefreshCw01 />}
            >
              Clear Params
            </Button>
          </Box>
        </Box>
      </Card>

      <Alert variant="primary" placement="inline">
        The transaction builder lets you build a new Stellar transaction. This
        transaction will start out with no signatures. To make it into the
        ledger, this transaction will then need to be signed and submitted to
        the network.
      </Alert>

      <>
        {formErrors.length > 0 ? (
          <ValidationResponseCard
            variant="primary"
            title="Transaction building errors:"
            response={
              <ul>
                {formErrors.map((e, i) => (
                  <li key={`e-${i}`}>{e}</li>
                ))}
              </ul>
            }
          />
        ) : null}
      </>
    </Box>
  );
};
