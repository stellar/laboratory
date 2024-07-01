"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Icon,
  Select,
  Notification,
} from "@stellar/design-system";

import { formComponentTemplateTxnOps } from "@/components/formComponentTemplateTxnOps";
import { Box } from "@/components/layout/Box";
import { TabbedButtons } from "@/components/TabbedButtons";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { SdsLink } from "@/components/SdsLink";
import { SaveTransactionModal } from "@/components/SaveTransactionModal";

import { arrayItem } from "@/helpers/arrayItem";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";

import { TRANSACTION_OPERATIONS } from "@/constants/transactionOperations";
import { useStore } from "@/store/useStore";
import {
  AnyObject,
  AssetObject,
  AssetObjectValue,
  AssetPoolShareObjectValue,
  NumberFractionValue,
  OptionSigner,
  RevokeSponsorshipValue,
  TxnOperation,
} from "@/types/types";

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
  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);

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

  const missingSelectedAssetFields = (
    param: string,
    value: any,
  ): { isAssetField: boolean; missingAssetFields: string[] } => {
    const assetInputs = [
      "asset",
      "selling",
      "buying",
      "send_asset",
      "dest_asset",
      "line",
    ];
    const isAssetField = assetInputs.includes(param);

    const initialValues = {
      isAssetField,
      missingAssetFields: [],
    };

    if (isAssetField) {
      if (!value || value.type === "native") {
        return initialValues;
      }

      if (value.type === "liquidity_pool_shares") {
        const validateAsset = (asset: AssetObjectValue) =>
          asset.type === "native" || Boolean(asset.code && asset.issuer);

        return {
          isAssetField: true,
          missingAssetFields:
            validateAsset(value.asset_a) && validateAsset(value.asset_b)
              ? []
              : [param],
        };
      }

      return {
        isAssetField,
        missingAssetFields: value.code && value.issuer ? [] : [param],
      };
    }

    // Multi-asset
    if (param === "path") {
      const missingValues = value
        .map((v: AssetObjectValue) => {
          if (!v.type) {
            return true;
          }

          if (v.type === "native") {
            return false;
          }

          if (v.code && v.issuer) {
            return false;
          }

          return true;
        })
        .filter((b: boolean) => b);

      if (missingValues.length > 0) {
        return {
          isAssetField: true,
          missingAssetFields: [param],
        };
      }
    }

    return initialValues;
  };

  const isMissingSelectedSignerFields = (
    param: string,
    value: OptionSigner | undefined,
  ) => {
    if (param === "signer") {
      if (!value?.type) {
        return false;
      }

      return !(value.key && value.weight);
    }

    return false;
  };

  const isMissingNumberFractionFields = (
    param: string,
    value: NumberFractionValue | undefined,
  ) => {
    if (["min_price", "max_price"].includes(param)) {
      if (!value?.type || !value.value) {
        return true;
      }

      return typeof value.value === "string"
        ? !value.value
        : !(value.value?.n && value.value.d);
    }

    return false;
  };

  const isMissingRevokeSponsorshipFields = (
    param: string,
    value: RevokeSponsorshipValue | undefined,
  ) => {
    if (param === "revokeSponsorship") {
      if (!value?.type || !value.data) {
        return false;
      }

      switch (value.type) {
        case "account":
          return !value.data.account_id;
        case "trustline":
          return !(
            value.data.account_id &&
            value.data.asset?.code &&
            value.data.asset?.issuer
          );

        case "offer":
          return !(value.data.seller_id && value.data.offer_id);
        case "data":
          return !(value.data.account_id && value.data.data_name);
        case "claimable_balance":
          return !value.data.balance_id;
        case "signer":
          return !(
            value.data.account_id &&
            value.data.signer?.type &&
            value.data.signer?.key
          );
        default:
          return false;
      }
    }

    return false;
  };

  const isMissingClaimantFields = (
    param: string,
    value: AnyObject[] | undefined,
  ) => {
    if (param === "claimants") {
      if (!value || value.length === 0) {
        return false;
      }

      let missing = false;

      (value || []).forEach((val) => {
        if (
          !val.destination ||
          !val.predicate ||
          isEmptyObject(val.predicate)
        ) {
          missing = true;
        }

        // Check only if nothing is missing yet
        if (!missing) {
          const missingPredicate = loopPredicate(val.predicate, []);

          missing = Boolean(missingPredicate && missingPredicate?.length > 0);
        }
      });

      return missing;
    }

    return false;
  };

  const loopPredicate = (
    predicate: AnyObject = {},
    missingArray: boolean[],
  ) => {
    if (isEmptyObject(predicate)) {
      missingArray.push(true);
    }

    Object.entries(predicate).forEach(([key, val]) => {
      if (["relative", "absolute"].includes(key) && typeof val === "string") {
        if (!val) {
          missingArray.push(true);
        }
      }

      if (Array.isArray(val)) {
        val.forEach((v) => loopPredicate(v, missingArray));
      } else if (typeof val === "object") {
        if (isEmptyObject(val)) {
          if (key !== "unconditional") {
            missingArray.push(true);
          }
        } else {
          loopPredicate(val, missingArray);
        }
      }
    });

    return missingArray;
  };

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
    const validateFn = formComponentTemplateTxnOps({
      param: opParam,
      opType,
      index: opIndex,
    })?.validate;

    const opError =
      opParamError || operationsError[opIndex] || EMPTY_OPERATION_ERROR;
    const opParamErrorFields = { ...opError.error };
    let opParamMissingFields = [...opError.missingFields];

    //==== Handle input validation for entered value
    if (validateFn) {
      const error = validateFn(opValue);

      if (error) {
        opParamErrorFields[opParam] = error;
      } else if (opParamErrorFields[opParam]) {
        delete opParamErrorFields[opParam];
      }
    }

    //==== Handle missing required fields
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
      if (
        !opValue &&
        TRANSACTION_OPERATIONS[opType].requiredParams.includes(opParam)
      ) {
        opParamMissingFields = [...opParamMissingFields, opParam];
      }
    }

    //==== Handle selected asset with missing fields
    const missingAsset = missingSelectedAssetFields(opParam, opValue);

    if (
      missingAsset.isAssetField &&
      missingAsset.missingAssetFields.length > 0
    ) {
      // If there is a missing asset value and the param is not in required
      // fields, add it to the missing fields
      if (!opParamMissingFields.includes(opParam)) {
        opParamMissingFields = [...opParamMissingFields, opParam];
      }
    }

    //==== Handle selected signer type
    const missingSigner = isMissingSelectedSignerFields(opParam, opValue);

    if (missingSigner && !opParamMissingFields.includes(opParam)) {
      opParamMissingFields = [...opParamMissingFields, opParam];
    }

    //==== Handle number fraction (liquidity pool deposit)
    const missingFractionFields = isMissingNumberFractionFields(
      opParam,
      opValue,
    );

    if (missingFractionFields && !opParamMissingFields.includes(opParam)) {
      opParamMissingFields = [...opParamMissingFields, opParam];
    }

    //==== Handle revoke sponsorship
    const missingRevokeSponsorshipFields = isMissingRevokeSponsorshipFields(
      opParam,
      opValue,
    );

    if (
      missingRevokeSponsorshipFields &&
      !opParamMissingFields.includes(opParam)
    ) {
      opParamMissingFields = [...opParamMissingFields, opParam];
    }

    //==== Handle claimable balance claimants
    const missingClaimantFields = isMissingClaimantFields(opParam, opValue);

    if (missingClaimantFields && !opParamMissingFields.includes(opParam)) {
      opParamMissingFields = [...opParamMissingFields, opParam];
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
      params: sanitizeObject({
        ...op?.params,
        [opParam]: opValue,
      }),
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

  const renderSourceAccount = (opType: string, index: number) => {
    const sourceAccountComponent = formComponentTemplateTxnOps({
      param: "source_account",
      opType,
      index,
    });

    return opType && sourceAccountComponent
      ? sourceAccountComponent.render({
          value: txnOperations[index].source_account,
          error: operationsError[index]?.error?.["source_account"],
          isRequired: false,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            handleOperationSourceAccountChange(index, e.target.value, opType);
          },
        })
      : null;
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

  const renderCustom = (operationType: string) => {
    if (operationType === "allow_trust") {
      return (
        <Notification variant="error" title="Deprecated">
          This operation is deprecated as of Protocol 17. Prefer
          SetTrustLineFlags instead.
        </Notification>
      );
    }

    return null;
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
      <>
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
          <option value="payment">Payment</option>
          <option value="path_payment_strict_send">
            Path Payment Strict Send
          </option>
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
          <option value="create_claimable_balance">
            Create Claimable Balance
          </option>
          <option value="claim_claimable_balance">
            Claim Claimable Balance
          </option>
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
          <option value="liquidity_pool_withdraw">
            Liquidity Pool Withdraw
          </option>
        </Select>

        {renderCustom(operationType)}
      </>
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
                    variant="secondary"
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
                      const component = formComponentTemplateTxnOps({
                        param: input,
                        opType: op.operation_type,
                        index: idx,
                        custom:
                          TRANSACTION_OPERATIONS[op.operation_type].custom?.[
                            input
                          ],
                      });
                      const baseProps = {
                        value: txnOperations[idx]?.params[input],
                        error: operationsError[idx]?.error?.[input],
                        isRequired:
                          TRANSACTION_OPERATIONS[
                            op.operation_type
                          ].requiredParams.includes(input),
                      };

                      if (component) {
                        switch (input) {
                          case "asset":
                          case "buying":
                          case "selling":
                          case "send_asset":
                          case "dest_asset":
                            return component.render({
                              ...baseProps,
                              onChange: (assetValue: AssetObjectValue) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: assetValue,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "authorize":
                            return component.render({
                              ...baseProps,
                              onChange: (selected: string | undefined) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: selected,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "claimants":
                            return component.render({
                              ...baseProps,
                              onChange: (
                                claimants: AnyObject[] | undefined,
                              ) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: claimants,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "line":
                            return component.render({
                              ...baseProps,
                              onChange: (
                                assetValue:
                                  | AssetObjectValue
                                  | AssetPoolShareObjectValue,
                              ) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: assetValue,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "min_price":
                          case "max_price":
                            return component.render({
                              ...baseProps,
                              onChange: (value: NumberFractionValue) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: value,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "path":
                            return component.render({
                              ...baseProps,
                              onChange: (path: AssetObject[]) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: path,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "revokeSponsorship":
                            return component.render({
                              ...baseProps,
                              onChange: (
                                value: RevokeSponsorshipValue | undefined,
                              ) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: value,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "clear_flags":
                          case "set_flags":
                            return component.render({
                              ...baseProps,
                              onChange: (value: string[]) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: value,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          case "signer":
                            return component.render({
                              ...baseProps,
                              onChange: (value: OptionSigner | undefined) => {
                                handleOperationParamChange({
                                  opIndex: idx,
                                  opParam: input,
                                  opValue: value,
                                  opType: op.operation_type,
                                });
                              },
                            });
                          default:
                            return component.render({
                              ...baseProps,
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
                      }

                      return null;
                    },
                  )}
                </>

                {/* Optional source account for all operations */}
                <>{renderSourceAccount(op.operation_type, idx)}</>
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

              <Button
                size="md"
                variant="tertiary"
                icon={<Icon.Save01 />}
                onClick={() => {
                  setIsSaveTxnModalVisible(true);
                }}
                title="Save transaction"
              ></Button>
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

      <SaveTransactionModal
        type="save"
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
      />
    </Box>
  );
};
