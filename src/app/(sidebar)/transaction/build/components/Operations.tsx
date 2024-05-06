"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Badge, Button, Card, Icon, Select } from "@stellar/design-system";

import { formComponentTemplate } from "@/components/formComponentTemplate";
import { Box } from "@/components/layout/Box";
import { TabbedButtons } from "@/components/TabbedButtons";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { arrayItem } from "@/helpers/arrayItem";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { useStore } from "@/store/useStore";
import { TxnOperation } from "@/types/types";
import { SdsLink } from "@/components/SdsLink";

export const Operations = () => {
  const { transaction } = useStore();
  const { operations: txnOperations } = transaction.build;
  const {
    updateBuildOperations,
    updateBuildSingleOperation,
    updateBuildIsValid,
  } = transaction;

  // Types
  type OperationError = {
    operationType: string;
    error: { [key: string]: string };
    missingFields: string[];
  };

  type OpBuildingError = { label?: string; errorList?: string[] };

  const [operationsError, setOperationsError] = useState<OperationError[]>([]);

  const INITIAL_OPERATION: TxnOperation = {
    operation_type: "",
    params: [],
  };

  const EMPTY_OPERATION_ERROR: OperationError = {
    operationType: "",
    error: {},
    missingFields: [],
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

  // Preserve values and validate inputs when components mounts
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
          operationType: op.operation_type,
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
              opType: op.operation_type,
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
              opType: op.operation_type,
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

  const validateOperationParam = ({
    opIndex,
    opParam,
    opValue,
    opParamError = operationsError[opIndex],
    opType,
  }: {
    opIndex: number;
    opParam: string;
    opValue: any;
    opParamError?: OperationError;
    opType: string;
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
      operationType: opType,
      error: opParamErrorFields,
      missingFields: opParamMissingFields,
    };
  };

  const handleOperationParamChange = ({
    opIndex,
    opParam,
    opValue,
    opType,
  }: {
    opIndex: number;
    opParam: string;
    opValue: any;
    opType: string;
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
      opType,
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
    opType: string,
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
      opType,
    });

    const updatedOpParamError = arrayItem.update(
      operationsError,
      opIndex,
      validatedSourceAccount,
    );

    setOperationsError([...updatedOpParamError]);
  };

  const getOperationsError = () => {
    const allErrorMessages: OpBuildingError[] = [];

    operationsError.forEach((op, idx) => {
      const hasErrors = !isEmptyObject(op.error);
      const hasMissingFields = op.missingFields.length > 0;

      const opErrors: OpBuildingError = {};

      if (!op.operationType || hasErrors || hasMissingFields) {
        const opLabel = TRANSACTION_OPERATIONS[op.operationType]?.label;
        opErrors.label = `Operation #${idx + 1}${opLabel ? `: ${opLabel}` : ""}`;
        opErrors.errorList = [];

        if (!op.operationType) {
          opErrors.errorList.push("Select operation type");
        }

        if (hasMissingFields) {
          opErrors.errorList.push("Fill out all required fields");
        }

        if (hasErrors) {
          const errorCount = Object.keys(op.error).length;

          opErrors.errorList.push(
            errorCount === 1 ? "Fix error" : "Fix errors",
          );
        }
      }

      if (!isEmptyObject(opErrors)) {
        allErrorMessages.push(opErrors);
      }
    });

    // Callback to the parent component
    updateBuildIsValid({ operations: allErrorMessages.length === 0 });

    return allErrorMessages;
  };

  const formErrors = getOperationsError();
  const sourceAccountComponent = formComponentTemplate("source_account");

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
  }) => {
    const opInfo =
      (operationType && TRANSACTION_OPERATIONS[operationType]) || null;

    return (
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
                ...(TRANSACTION_OPERATIONS[e.target.value]?.requiredParams ||
                  []),
              ],
              operationType: e.target.value,
            };
          }

          setOperationsError([
            ...arrayItem.update(operationsError, index, initParamError),
          ]);
        }}
        note={
          opInfo ? (
            <>
              {opInfo.description}{" "}
              <SdsLink href={opInfo.docsUrl}>See documentation</SdsLink>.
            </>
          ) : null
        }
      >
        <option value="">Select operation type</option>
        <option value="create_account">Create Account</option>
        {/* TODO: remove disabled attribute when operation is implemented */}
        <option value="payment" disabled>
          Payment
        </option>
        <option value="path_payment_strict_send" disabled>
          Path Payment Strict Send
        </option>
        <option value="path_payment_strict_receive" disabled>
          Path Payment Strict Receive
        </option>
        <option value="manage_sell_offer" disabled>
          Manage Sell Offer
        </option>
        <option value="manage_buy_offer" disabled>
          Manage Buy Offer
        </option>
        <option value="create_passive_sell_offer" disabled>
          Create Passive Sell Offer
        </option>
        <option value="set_options" disabled>
          Set Options
        </option>
        <option value="change_trust" disabled>
          Change Trust
        </option>
        <option value="allow_trust" disabled>
          Allow Trust
        </option>
        <option value="account_merge" disabled>
          Account Merge
        </option>
        <option value="manage_data" disabled>
          Manage Data
        </option>
        <option value="bump_sequence" disabled>
          Bump Sequence
        </option>
        <option value="create_claimable_balance" disabled>
          Create Claimable Balance
        </option>
        <option value="claim_claimable_balance" disabled>
          Claim Claimable Balance
        </option>
        <option value="begin_sponsoring_future_reserves" disabled>
          Begin Sponsoring Future Reserves
        </option>
        <option value="end_sponsoring_future_reserves" disabled>
          End Sponsoring Future Reserves
        </option>
        <option value="revoke_sponsorship" disabled>
          Revoke Sponsorship
        </option>
        <option value="clawback" disabled>
          Clawback
        </option>
        <option value="clawback_claimable_balance" disabled>
          Clawback Claimable Balance
        </option>
        <option value="set_trust_line_flags" disabled>
          Set Trust Line Flags
        </option>
        <option value="liquidity_pool_deposit" disabled>
          Liquidity Pool Deposit
        </option>
        <option value="liquidity_pool_withdraw" disabled>
          Liquidity Pool Withdraw
        </option>
      </Select>
    );
  };

  return (
    <Box gap="md">
      <Card>
        <Box gap="lg">
          {/* Operations */}
          <>
            {txnOperations.map((op, idx) => (
              <Box key={`op-${idx}`} gap="lg" addlClassName="PageBody__content">
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
                              opType: op.operation_type,
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
                        error: operationsError[idx]?.error?.["source_account"],
                        isRequired: false,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          handleOperationSourceAccountChange(
                            idx,
                            e.target.value,
                            op.operation_type,
                          );
                        },
                      })
                    : null}
                </>
              </Box>
            ))}
          </>

          {/* Operations bottom buttons */}
          <Box gap="lg" direction="row" align="center" justify="space-between">
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

      <>
        {formErrors.length > 0 ? (
          <ValidationResponseCard
            variant="primary"
            title="Transaction building errors:"
            response={
              <Box gap="sm">
                <>
                  {formErrors.map((e, i) => (
                    <Box gap="sm" key={`e-${i}`}>
                      <>
                        {e.label ? <div>{e.label}</div> : null}
                        <ul>
                          {e.errorList?.map((ee, ei) => (
                            <li key={`e-${i}-${ei}`}>{ee}</li>
                          ))}
                        </ul>
                      </>
                    </Box>
                  ))}
                </>
              </Box>
            }
          />
        ) : null}
      </>
    </Box>
  );
};
