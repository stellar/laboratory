"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card } from "@stellar/design-system";
import { get, omit, set } from "lodash";
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

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { inputNumberValue } from "@/helpers/inputNumberValue";

import { useStore } from "@/store/useStore";
import { Routes } from "@/constants/routes";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { validate } from "@/validate";
import { AnyObject, EmptyObj } from "@/types/types";

export default function BuildTransaction() {
  const { transaction, network } = useStore();
  const { activeTab, params: txnParams } = transaction.build;
  const { updateBuildActiveTab, updateBuildParams } = transaction;

  const [isReady, setIsReady] = useState(false);
  const [paramsError, setParamsError] = useState<AnyObject>({});

  const requiredParams = ["source_account", "seq_num", "fee"] as const;

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

  // Need this to make sure the page doesn't render before we get the store data
  useEffect(() => {
    const init = async () => {
      await StellarXdr.init();
    };

    init();
    setIsReady(true);
  }, []);

  // TODO: validate fields on page load

  useEffect(() => {
    if (sequenceNumberData || sequenceNumberError) {
      const id = "seq_num";

      handleParamChange(id, inputNumberValue(sequenceNumberData));
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
    }, [] as string[]);
  };

  const renderTempXdr = () => {
    const missingParams = missingRequiredParams();

    if (missingParams.length > 0) {
      return <div>{`Required fields: ${missingParams.join(", ")}.`}</div>;
    }

    const memoValue = txnParams.memo;

    if (
      typeof memoValue === "object" &&
      !isEmptyObject(memoValue) &&
      !Object.values(memoValue)[0]
    ) {
      return <div>Need memo value</div>;
    }

    if (!isEmptyObject(paramsError)) {
      return <div>There are errors</div>;
    }

    try {
      // Format values to meet XDR requirements
      const prepTxnParams = Object.entries(txnParams).reduce(
        (res, [key, value]) => {
          let val;

          switch (key) {
            case "seq_num":
              val = Number(value);
              break;
            case "fee":
              val = Number(value);
              break;
            case "cond":
              val = {
                time: {
                  min_time: (value as any)?.time?.min_time
                    ? Number((value as any)?.time?.min_time)
                    : 0,
                  max_time: (value as any)?.time?.max_time
                    ? Number((value as any)?.time?.max_time)
                    : 0,
                },
              };
              break;
            case "memo":
              if ((value as any)?.id) {
                val = { id: Number((value as any).id) };
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
        },
        {},
      );

      const txnJson = {
        tx: {
          tx: {
            ...prepTxnParams,
            // TODO: add operations
            operations: [],
            ext: "v0",
          },
          // TODO: add signatures
          signatures: [],
        },
      };

      const xdr = StellarXdr.encode(
        "TransactionEnvelope",
        JSON.stringify(txnJson),
      );

      return <div style={{ wordWrap: "break-word" }}>{`XDR: ${xdr}`}</div>;
    } catch (e) {
      return <div>{`XDR error: ${e}`}</div>;
    }
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
                    const id = e.target.id;
                    handleParamChange(id, e.target.value);
                    handleError(id, validate.publicKey(e.target.value));
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
                  value={txnParams.seq_num?.toString() || ""}
                  error={paramsError.seq_num}
                  onChange={(e) => {
                    const id = e.target.id;
                    handleParamChange(id, inputNumberValue(e.target.value));
                    handleError(id, validate.positiveInt(e.target.value));
                  }}
                  onBlur={(e) => {
                    handleError(
                      e.target.id,
                      validate.positiveInt(e.target.value),
                    );
                  }}
                  note="The transaction sequence number is usually one higher than current account sequence number."
                  rightElement={
                    <InputSideElement
                      variant="button"
                      onClick={() => fetchSequenceNumber()}
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
                  value={txnParams.fee?.toString() || ""}
                  error={paramsError.fee}
                  onChange={(e) => {
                    const id = e.target.id;
                    handleParamChange(id, inputNumberValue(e.target.value));
                    handleError(id, validate.positiveInt(e.target.value));
                  }}
                  onBlur={(e) => {
                    handleError(
                      e.target.id,
                      validate.positiveInt(e.target.value),
                    );
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
                    handleError(id, validate.memo(memo));
                  }}
                />

                <TimeBoundsPicker
                  id="time"
                  value={{
                    min_time: txnParams.cond?.time?.min_time?.toString(),
                    max_time: txnParams.cond?.time?.max_time?.toString(),
                  }}
                  labelSuffix="optional"
                  error={paramsError.cond?.time}
                  onChange={(timeBounds) => {
                    const id = "cond.time";
                    handleParamChange(id, timeBounds);
                    handleError(id, validate.timeBounds(timeBounds));
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

          {renderTempXdr()}
        </>
      </Box>
    );
  };

  // TODO: render operations
  const renderOperations = () => {
    return <Card>Operations</Card>;
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
