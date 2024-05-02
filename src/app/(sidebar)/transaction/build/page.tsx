"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  Select,
} from "@stellar/design-system";
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
import { TabbedButtons } from "@/components/TabbedButtons";
import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { formComponentTemplate } from "@/components/formComponentTemplate";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { arrayItem } from "@/helpers/arrayItem";

import { useStore } from "@/store/useStore";
import { TransactionBuildParams } from "@/store/createStore";
import { Routes } from "@/constants/routes";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { validate } from "@/validate";
import { EmptyObj, KeysOfUnion, TxnOperation } from "@/types/types";

export default function BuildTransaction() {
  const { transaction, network } = useStore();
  const {
    activeTab,
    params: txnParams,
    operations: txnOperations,
  } = transaction.build;
  const {
    updateBuildActiveTab,
    updateBuildParams,
    updateBuildOperations,
    updateBuildSingleOperation,
    resetBuildParams,
  } = transaction;

  type OperationError = {
    error: { [key: string]: string };
    missingFields: string[];
  };

  const [paramsError, setParamsError] = useState<ParamsError>({});
  const [operationsError, setOperationsError] = useState<OperationError[]>([]);

  const INITIAL_OPERATION: TxnOperation = {
    operation_type: "",
    params: [],
  };

  const EMPTY_OPERATION_ERROR: OperationError = {
    error: {},
    missingFields: [],
  };

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

  const updateOptionParamAndError = ({
    type,
    index,
    item,
  }: {
    type:
      | "add"
      | "delete"
      | "move-before"
      | "move-after"
      | "duplicate"
      | "reset";
    index?: number;
    item?: any;
  }) => {
    switch (type) {
      case "add":
        if (item !== undefined) {
          updateBuildOperations([...txnOperations, item]);
          setOperationsError([...operationsError, EMPTY_OPERATION_ERROR]);
        }
        break;
      case "duplicate":
        if (index !== undefined) {
          updateBuildOperations([...arrayItem.duplicate(txnOperations, index)]);
          setOperationsError([...arrayItem.duplicate(operationsError, index)]);
        }
        break;
      case "move-after":
        if (index !== undefined) {
          updateBuildOperations([
            ...arrayItem.move(txnOperations, index, "after"),
          ]);
          setOperationsError([
            ...arrayItem.move(operationsError, index, "after"),
          ]);
        }
        break;
      case "move-before":
        if (index !== undefined) {
          updateBuildOperations([
            ...arrayItem.move(txnOperations, index, "before"),
          ]);
          setOperationsError([
            ...arrayItem.move(operationsError, index, "before"),
          ]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          updateBuildOperations([...arrayItem.delete(txnOperations, index)]);
          setOperationsError([...arrayItem.delete(operationsError, index)]);
        }
        break;
      case "reset":
        updateBuildOperations([INITIAL_OPERATION]);
        setOperationsError([EMPTY_OPERATION_ERROR]);
        break;

      default:
      // do nothing
    }
  };

  useEffect(() => {
    // Stellar XDR init
    const init = async () => {
      await StellarXdr.init();
    };

    init();
  }, []);

  useEffect(() => {
    // If no operations to preserve, add inital operation and error template
    if (txnOperations.length === 0) {
      updateOptionParamAndError({ type: "add", item: INITIAL_OPERATION });
    } else {
      // Validate all params in all operations
      const errors: OperationError[] = [];

      txnOperations.forEach((op, idx) => {
        const opRequiredFields = [
          ...(TRANSACTION_OPERATIONS[op.operation_type]?.requiredParams || []),
        ];

        const missingFields = opRequiredFields.reduce((res, cur) => {
          if (!op.params[cur]) {
            return [...res, cur];
          }

          return res;
        }, [] as string[]);

        let opErrors: OperationError = {
          ...EMPTY_OPERATION_ERROR,
          missingFields,
        };

        // Params
        Object.entries(op.params).forEach(([key, value]) => {
          opErrors = {
            ...opErrors,
            ...validateOperationParam({
              opIndex: idx,
              opParam: key,
              opValue: value,
              opParamError: opErrors,
            }),
          };
        });

        // Source account
        if (op.source_account) {
          opErrors = {
            ...opErrors,
            ...validateOperationParam({
              opIndex: idx,
              opParam: "source_account",
              opValue: op.source_account,
              opParamError: opErrors,
            }),
          };
        }

        errors.push(opErrors);
      });

      setOperationsError([...errors]);
    }
    // Check this only when mounts, don't need to check any dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderParams = () => {
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
                  If you don’t have an account yet, you can create and fund a
                  test net account with the{" "}
                  <SdsLink href={Routes.ACCOUNT_CREATE}>
                    account creator
                  </SdsLink>
                  .
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
                  isLoading={
                    isFetchingSequenceNumber || isLoadingSequenceNumber
                  }
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
                  The{" "}
                  <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering">
                    network base fee
                  </SdsLink>{" "}
                  is currently set to 100 stroops (0.00001 lumens). Based on
                  current network activity, we suggest setting it to 100
                  stroops. Final transaction fee is equal to base fee times
                  number of operations in this transaction.
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

            <Box
              gap="md"
              direction="row"
              align="center"
              justify="space-between"
            >
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

        <BuildingError errorList={getParamsError()} />
      </Box>
    );
  };

  const OperationTabbedButtons = ({
    index,
    isUpDisabled,
    isDownDisabled,
    isDeleteDisabled,
  }: {
    index: number;
    isUpDisabled: boolean;
    isDownDisabled: boolean;
    isDeleteDisabled: boolean;
  }) => {
    return (
      <TabbedButtons
        size="md"
        buttons={[
          {
            id: "moveUp",
            hoverTitle: "Move up",
            icon: <Icon.ArrowUp />,
            onClick: () =>
              updateOptionParamAndError({
                type: "move-before",
                index,
              }),
            isDisabled: isUpDisabled,
          },
          {
            id: "moveDown",
            hoverTitle: "Move down",
            icon: <Icon.ArrowDown />,
            onClick: () =>
              updateOptionParamAndError({
                type: "move-after",
                index,
              }),
            isDisabled: isDownDisabled,
          },
          {
            id: "duplicate",
            hoverTitle: "Duplicate",
            icon: <Icon.Copy07 />,
            onClick: () =>
              updateOptionParamAndError({
                type: "duplicate",
                index,
              }),
          },
          {
            id: "delete",
            hoverTitle: "Delete",
            icon: <Icon.Trash01 />,
            isError: true,
            isDisabled: isDeleteDisabled,
            onClick: () =>
              updateOptionParamAndError({
                type: "delete",
                index,
              }),
          },
        ]}
      />
    );
  };

  const OperationTypeSelector = ({
    index,
    operationType,
  }: {
    index: number;
    operationType: string;
  }) => (
    <Select
      fieldSize="md"
      id={`${index}-operationType`}
      label="Operation type"
      value={operationType}
      infoLink="https://developers.stellar.org/docs/start/list-of-operations/"
      onChange={(e) => {
        updateBuildSingleOperation(index, {
          operation_type: e.target.value,
          params: [],
          source_account: "",
        });

        let initParamError: OperationError = EMPTY_OPERATION_ERROR;

        // Get operation required fields if there is operation type
        if (e.target.value) {
          initParamError = {
            ...initParamError,
            missingFields: [
              ...(TRANSACTION_OPERATIONS[e.target.value]?.requiredParams || []),
            ],
          };
        }

        setOperationsError([
          ...arrayItem.update(operationsError, index, initParamError),
        ]);
      }}
    >
      <option value="">Select operation type</option>
      <option value="create_account">Create Account</option>
      <option value="payment">Payment</option>
      <option value="path_payment_strict_send">Path Payment Strict Send</option>
      <option value="path_payment_strict_receive">
        Path Payment Strict Receive
      </option>
      <option value="manage_sell_offer">Manage Sell Offer</option>
      <option value="manage_buy_offer">Manage Buy Offer</option>
      <option value="create_passive_sell_offer">
        Create Passive Sell Offer
      </option>
      <option value="set_options">Set Options</option>
      <option value="change_trust">Change Trust</option>
      <option value="allow_trust">Allow Trust</option>
      <option value="account_merge">Account Merge</option>
      <option value="manage_data">Manage Data</option>
      <option value="bump_sequence">Bump Sequence</option>
      <option value="create_claimable_balance">Create Claimable Balance</option>
      <option value="claim_claimable_balance">Claim Claimable Balance</option>
      <option value="begin_sponsoring_future_reserves">
        Begin Sponsoring Future Reserves
      </option>
      <option value="end_sponsoring_future_reserves">
        End Sponsoring Future Reserves
      </option>
      <option value="revoke_sponsorship">Revoke Sponsorship</option>
      <option value="clawback">Clawback</option>
      <option value="clawback_claimable_balance">
        Clawback Claimable Balance
      </option>
      <option value="set_trust_line_flags">Set Trust Line Flags</option>
      <option value="liquidity_pool_deposit">Liquidity Pool Deposit</option>
      <option value="liquidity_pool_withdraw">Liquidity Pool Withdraw</option>
    </Select>
  );

  const validateOperationParam = ({
    opIndex,
    opParam,
    opValue,
    opParamError = operationsError[opIndex],
  }: {
    opIndex: number;
    opParam: string;
    opValue: any;
    opParamError?: OperationError;
  }): OperationError => {
    const validateFn = formComponentTemplate(opParam)?.validate;

    const opError =
      opParamError || operationsError[opIndex] || EMPTY_OPERATION_ERROR;
    const opParamErrorFields = { ...opError.error };
    let opParamMissingFields = [...opError.missingFields];

    if (validateFn) {
      const error = validateFn(opValue);

      if (error) {
        opParamErrorFields[opParam] = error;
      } else if (opParamErrorFields[opParam]) {
        delete opParamErrorFields[opParam];
      }
    }

    // If param needs value and there is value entered, remove param from
    // missing fields. If there is no value, nothing to do.
    if (opParamMissingFields.includes(opParam)) {
      if (opValue) {
        opParamMissingFields = [...opParamMissingFields].filter(
          (p) => p !== opParam,
        );
      }
      // If param is not in missing fields and has not value, add the param to
      // missing fields. If there is value, nothing to do.
    } else {
      if (!opValue) {
        opParamMissingFields = [...opParamMissingFields, opParam];
      }
    }

    return {
      error: opParamErrorFields,
      missingFields: opParamMissingFields,
    };
  };

  const handleOperationParamChange = ({
    opIndex,
    opParam,
    opValue,
  }: {
    opIndex: number;
    opParam: string;
    opValue: any;
  }) => {
    const op = txnOperations[opIndex];

    updateBuildSingleOperation(opIndex, {
      ...op,
      params: {
        ...op?.params,
        [opParam]: opValue,
      },
    });

    const validatedOpParam = validateOperationParam({
      opIndex,
      opParam,
      opValue,
    });
    const updatedOpParamError = arrayItem.update(
      operationsError,
      opIndex,
      validatedOpParam,
    );

    setOperationsError([...updatedOpParamError]);
  };

  const handleOperationSourceAccountChange = (
    opIndex: number,
    opValue: any,
  ) => {
    const op = txnOperations[opIndex];

    updateBuildSingleOperation(opIndex, {
      ...op,
      source_account: opValue,
    });

    const validatedSourceAccount = validateOperationParam({
      opIndex,
      opParam: "source_account",
      opValue,
    });

    const updatedOpParamError = arrayItem.update(
      operationsError,
      opIndex,
      validatedSourceAccount,
    );

    setOperationsError([...updatedOpParamError]);
  };

  const renderOperations = () => {
    const txnXdr = txnJsonToXdr();
    const sourceAccountComponent = formComponentTemplate("source_account");

    console.log(">>> txnOperations: ", txnOperations);
    console.log(">>> operationsError: ", operationsError);
    console.log(">>>");

    return (
      <Box gap="md">
        <Card>
          <Box gap="lg">
            {/* Operations */}
            <>
              {txnOperations.map((op, idx) => (
                <Box
                  key={`op-${idx}`}
                  gap="lg"
                  addlClassName="PageBody__content"
                >
                  {/* Operation label and action buttons */}
                  <Box
                    gap="lg"
                    direction="row"
                    align="center"
                    justify="space-between"
                  >
                    <Badge
                      size="md"
                      variant="primary"
                    >{`Operation ${idx + 1}`}</Badge>

                    <OperationTabbedButtons
                      index={idx}
                      isUpDisabled={idx === 0}
                      isDownDisabled={idx === txnOperations.length - 1}
                      isDeleteDisabled={txnOperations.length === 1}
                    />
                  </Box>

                  <OperationTypeSelector
                    index={idx}
                    operationType={op.operation_type}
                  />

                  {/* Operation params */}
                  <>
                    {TRANSACTION_OPERATIONS[op.operation_type]?.params.map(
                      (input) => {
                        const component = formComponentTemplate(input);

                        if (component) {
                          return component.render({
                            value: txnOperations[idx]?.params[input],
                            error: operationsError[idx]?.error?.[input],
                            isRequired:
                              TRANSACTION_OPERATIONS[
                                op.operation_type
                              ].requiredParams.includes(input),
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              handleOperationParamChange({
                                opIndex: idx,
                                opParam: input,
                                opValue: e.target.value,
                              });
                            },
                          });
                        }

                        return null;
                      },
                    )}
                  </>

                  {/* Optional source account for all operations */}
                  <>
                    {op.operation_type && sourceAccountComponent
                      ? sourceAccountComponent.render({
                          value: txnOperations[idx].source_account,
                          error:
                            operationsError[idx]?.error?.["source_account"],
                          isRequired: false,
                          onChange: (e: ChangeEvent<HTMLInputElement>) => {
                            handleOperationSourceAccountChange(
                              idx,
                              e.target.value,
                            );
                          },
                        })
                      : null}
                  </>
                </Box>
              ))}
            </>

            {/* Operations bottom buttons */}
            <Box
              gap="lg"
              direction="row"
              align="center"
              justify="space-between"
            >
              <Box gap="sm" direction="row" align="center">
                <Button
                  size="md"
                  variant="secondary"
                  icon={<Icon.PlusCircle />}
                  onClick={() => {
                    updateOptionParamAndError({
                      type: "add",
                      item: INITIAL_OPERATION,
                    });
                  }}
                >
                  Add Operation
                </Button>

                {/* TODO: add share and save buttons */}
              </Box>

              <Button
                size="md"
                variant="error"
                icon={<Icon.RefreshCw01 />}
                onClick={() => {
                  updateOptionParamAndError({ type: "reset" });
                }}
              >
                Clear Operations
              </Button>
            </Box>
          </Box>
        </Card>

        <Card>
          {/* TODO: style XDR and handle error */}
          <div>{txnXdr.xdr ?? null}</div>
        </Card>
      </Box>
    );
  };

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
