"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card } from "@stellar/design-system";
import { MemoValue } from "@stellar/stellar-sdk";
import { get, omit, set } from "lodash";
import { stringify } from "lossless-json";

import * as StellarXdr from "@/helpers/StellarXdr";

import { TabView } from "@/components/TabView";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import {
  MemoPicker,
  MemoPickerValue,
} from "@/components/FormElements/MemoPicker";
import { TimeBoundsPicker } from "@/components/FormElements/TimeBoundsPicker";
import { InputSideElement } from "@/components/InputSideElement";
import { ErrorListCard } from "@/components/ErrorListCard";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";

import { useStore } from "@/store/useStore";
import { TransactionBuildParams } from "@/store/createStore";
import { Routes } from "@/constants/routes";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { validate } from "@/validate";
import { EmptyObj, KeysOfUnion } from "@/types/types";

export default function BuildTransaction() {
  const { transaction, network } = useStore();
  const { activeTab, params: txnParams } = transaction.build;
  const { updateBuildActiveTab, updateBuildParams } = transaction;

  const [isReady, setIsReady] = useState(false);
  const [paramsError, setParamsError] = useState<ParamsError>({});

  const requiredParams = ["source_account", "seq_num", "fee"] as const;
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

  const handleParamChange = <T,>(paramPath: string, value: T) => {
    updateBuildParams(set({}, `${paramPath}`, value));
  };

  const handleError = <T,>(id: string, error: T) => {
    if (error) {
      setParamsError(set({ ...paramsError }, id, error));
    } else if (get(paramsError, id)) {
      setParamsError(sanitizeObject(omit({ ...paramsError }, id), true));
    }
  };

  const validateParam = (param: ParamsField, value: any) => {
    switch (param) {
      case "cond":
        return validate.timeBounds(value?.time || value);
      case "fee":
        return validate.positiveInt(value);
      case "memo":
        if (!value || isEmptyObject(value)) {
          return false;
        }

        // Memo in store is in transaction format { memoType: memoValue }
        if (value.type) {
          return validate.memo(value);
        } else {
          // Changing it to { type, value } format if needed
          const [type, val] = Object.entries(value)[0];
          return validate.memo({ type, value: val as MemoValue });
        }

      case "seq_num":
        return validate.positiveInt(value);
      case "source_account":
        return validate.publicKey(value);
      default:
        return false;
    }
  };

  useEffect(() => {
    // Stellar XDR init
    const init = async () => {
      await StellarXdr.init();
    };

    init();
    // Need this to make sure the page doesn't render before we get the store data
    setIsReady(true);
  }, []);

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

  useEffect(() => {
    if (sequenceNumberData || sequenceNumberError) {
      const id = "seq_num";

      handleParamChange(id, sequenceNumberData);
      handleError(id, sequenceNumberError);
    }
    // Not inlcuding handleParamChange and handleError
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sequenceNumberData,
    sequenceNumberError,
    sequenceNumberDataUpdatedAt,
    sequenceNumberErrorUpdatedAt,
  ]);

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

    return allErrorMessages;
  };

  const txnJsonToXdr = () => {
    if (getParamsError().length !== 0) {
      return {};
    }

    try {
      // TODO: remove this formatter once Stellar XDR supports strings for numbers.
      // Format values to meet XDR requirements
      const prepTxnParams = Object.entries(txnParams).reduce((res, param) => {
        const key = param[0] as ParamsField;
        // Casting to any type for simplicity
        const value = param[1] as any;

        let val;

        switch (key) {
          case "seq_num":
            val = BigInt(value);
            break;
          case "fee":
            val = BigInt(value);
            break;
          case "cond":
            // eslint-disable-next-line no-case-declarations
            const minTime = value?.time?.min_time;
            // eslint-disable-next-line no-case-declarations
            const maxTime = value?.time?.max_time;

            val = {
              time: {
                min_time: minTime ? BigInt(minTime) : 0,
                max_time: maxTime ? BigInt(maxTime) : 0,
              },
            };
            break;
          case "memo":
            // eslint-disable-next-line no-case-declarations
            const memoId = value?.id;

            if (memoId) {
              val = { id: BigInt(memoId) };
            } else {
              val =
                typeof value === "object" && isEmptyObject(value)
                  ? "none"
                  : value;
            }

            break;
          default:
            val = value;
        }

        return { ...res, [key]: val };
      }, {});

      const txnJson = {
        tx: {
          tx: {
            ...prepTxnParams,
            // TODO: add operations
            operations: [],
            ext: "v0",
          },
          signatures: [],
        },
      };

      // TODO: Temp fix until Stellar XDR supports strings for big numbers
      // const jsonString = JSON.stringify(txnJson);
      const jsonString = stringify(txnJson);

      return {
        xdr: StellarXdr.encode("TransactionEnvelope", jsonString || ""),
      };
    } catch (e) {
      return { error: `XDR error: ${e}` };
    }
  };

  const BuildingError = ({ errorList }: { errorList: string[] }) => {
    if (errorList.length === 0) {
      return null;
    }

    return (
      <ErrorListCard
        title="Transaction building errors:"
        errorList={errorList}
      />
    );
  };

  // TODO: add info links
  const renderParams = () => {
    return (
      <Box gap="md">
        <>
          <Card>
            <Box gap="lg">
              <>
                <PubKeyPicker
                  id="source_account"
                  label="Source Account"
                  value={txnParams.source_account}
                  error={paramsError.source_account}
                  onChange={(e) => {
                    const id = "source_account";
                    handleParamChange(id, e.target.value);
                    handleError(id, validateParam(id, e.target.value));
                  }}
                  note={
                    <>
                      If you don’t have an account yet, you can create and fund
                      a test net account with the{" "}
                      <SdsLink href={Routes.ACCOUNT_CREATE}>
                        account creator
                      </SdsLink>
                      .
                    </>
                  }
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
                    handleError(id, validateParam(id, e.target.value));
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
                      isLoading={
                        isFetchingSequenceNumber || isLoadingSequenceNumber
                      }
                    >
                      Fetch next sequence
                    </InputSideElement>
                  }
                />

                <PositiveIntPicker
                  id="fee"
                  label="Base Fee"
                  value={txnParams.fee}
                  error={paramsError.fee}
                  onChange={(e) => {
                    const id = "fee";
                    handleParamChange(id, e.target.value);
                    handleError(id, validateParam(id, e.target.value));
                  }}
                  note={
                    <>
                      The{" "}
                      <SdsLink href="https://developers.stellar.org/docs/learn/glossary#base-fee">
                        network base fee
                      </SdsLink>{" "}
                      is currently set to 100 stroops (0.00001 lumens). Based on
                      current network activity, we suggest setting it to 100
                      stroops. Final transaction fee is equal to base fee times
                      number of operations in this transaction.
                    </>
                  }
                />

                <MemoPicker
                  id="memo"
                  value={getMemoPickerValue()}
                  labelSuffix="optional"
                  error={paramsError.memo}
                  onChange={(_, memo) => {
                    const id = "memo";
                    handleParamChange(id, getMemoValue(memo));
                    handleError(id, validateParam(id, memo));
                  }}
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
                    handleError(id, validateParam("cond", timeBounds));
                  }}
                />

                <div>
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => {
                      updateBuildActiveTab("operations");
                    }}
                  >
                    Add Operations
                  </Button>
                </div>
              </>
            </Box>
          </Card>

          <Alert variant="primary" placement="inline">
            The transaction builder lets you build a new Stellar transaction.
            This transaction will start out with no signatures. To make it into
            the ledger, this transaction will then need to be signed and
            submitted to the network.
          </Alert>

          <BuildingError errorList={getParamsError()} />
        </>
      </Box>
    );
  };

  // TODO: render operations
  const renderOperations = () => {
    const txnXdr = txnJsonToXdr();

    return (
      <Card>
        Operations
        {/* TODO: style XDR and handle error */}
        <div>{txnXdr.xdr ?? null}</div>
      </Card>
    );
  };

  if (!isReady) {
    return null;
  }

  // TODO: ??? clear form button
  return (
    <div>
      <TabView
        heading={{ title: "Build Transaction" }}
        tab1={{
          id: "params",
          label: "Params",
          content: renderParams(),
        }}
        tab2={{
          id: "operations",
          label: "Operations",
          content: renderOperations(),
        }}
        activeTabId={activeTab}
        onTabChange={(id) => {
          updateBuildActiveTab(id);
        }}
      />
    </div>
  );
}
