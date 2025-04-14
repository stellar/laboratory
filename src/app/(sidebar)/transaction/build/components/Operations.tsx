"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Select, Notification } from "@stellar/design-system";

import { formComponentTemplateTxnOps } from "@/components/formComponentTemplateTxnOps";
import { SdsLink } from "@/components/SdsLink";
import { SorobanOperation } from "./SorobanOperation";
import { ClassicOperation } from "./ClassicOperation";

import { arrayItem } from "@/helpers/arrayItem";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { isSorobanOperationType } from "@/helpers/sorobanUtils";

import { OP_SET_TRUST_LINE_FLAGS } from "@/constants/settings";
import {
  EMPTY_OPERATION_ERROR,
  INITIAL_OPERATION,
  TRANSACTION_OPERATIONS,
  SET_TRUSTLINE_FLAGS_CUSTOM_MESSAGE,
} from "@/constants/transactionOperations";
import { useStore } from "@/store/useStore";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  AnyObject,
  AssetObjectValue,
  NumberFractionValue,
  OpBuildingError,
  OperationError,
  OptionSigner,
  RevokeSponsorshipValue,
} from "@/types/types";

export const Operations = () => {
  const { transaction } = useStore();
  const { classic, soroban } = transaction.build;

  // Classic Operations
  const { operations: txnOperations } = classic;
  // Soroban Operation
  const { operation: sorobanOperation } = soroban;

  const {
    // Classic
    updateBuildOperations,
    updateBuildSingleOperation,
    // Soroban
    updateSorobanBuildOperation,
    updateSorobanBuildXdr,
    // Either Classic or Soroban
    updateBuildIsValid,
    setBuildOperationsError,
  } = transaction;

  const [operationsError, setOperationsError] = useState<OperationError[]>([]);

  // For Classic Operations
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

  // For Soroban Operation
  const resetSorobanOperation = () => {
    updateSorobanBuildOperation(INITIAL_OPERATION);
    setOperationsError([EMPTY_OPERATION_ERROR]);
    updateSorobanBuildXdr("");
  };

  // Preserve values and validate inputs when components mounts
  useEffect(() => {
    // If no operations to preserve, add inital operation and error template
    if (txnOperations.length === 0 && !soroban.operation.operation_type) {
      // Default to classic operations empty state
      updateOptionParamAndError({ type: "add", item: INITIAL_OPERATION });
    } else {
      // If there are operations on mount, validate all params in all operations
      const errors: OperationError[] = [];

      // Soroban operation params validation
      if (soroban.operation.operation_type) {
        const sorobanOpRequiredFields = [
          ...(TRANSACTION_OPERATIONS[soroban.operation.operation_type]
            ?.requiredParams || []),
        ];

        const sorobanMissingFields = sorobanOpRequiredFields.reduce(
          (res, cur) => {
            if (!soroban.operation.params[cur]) {
              return [...res, cur];
            }
            return res;
          },
          [] as string[],
        );

        // Soroban Operation Error related
        let sorobanOpErrors: OperationError = {
          ...EMPTY_OPERATION_ERROR,
          missingFields: sorobanMissingFields,
          operationType: soroban.operation.operation_type,
        };

        // Soroban: Validate params
        Object.entries(soroban.operation.params).forEach(([key, value]) => {
          sorobanOpErrors = {
            ...sorobanOpErrors,
            ...validateOperationParam({
              // setting index to 0 because only one operation is allowed with Soroban
              opIndex: 0,
              opParam: key,
              opValue: value,
              opParamError: sorobanOpErrors,
              opType: soroban.operation.operation_type,
            }),
          };
        });

        // Validate source account if present
        if (soroban.operation.source_account) {
          sorobanOpErrors = {
            ...sorobanOpErrors,
            ...validateOperationParam({
              opIndex: 0, // setting index to 0 because only one operation is allowed with Soroban
              opParam: "source_account",
              opValue: soroban.operation.source_account,
              opParamError: sorobanOpErrors,
              opType: soroban.operation.operation_type,
            }),
          };
        }

        // Check for custom messages
        sorobanOpErrors = operationCustomMessage({
          opType: soroban.operation.operation_type,
          opIndex: 0, // setting index to 0 because only one operation is allowed with Soroban
          opError: sorobanOpErrors,
        });

        errors.push(sorobanOpErrors);
      } else {
        // Classic operation params validation
        txnOperations.forEach((op, idx) => {
          const opRequiredFields = [
            ...(TRANSACTION_OPERATIONS[op.operation_type]?.requiredParams ||
              []),
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

          // Missing optional selection
          opErrors = operationCustomMessage({
            opType: op.operation_type,
            opIndex: idx,
            opError: opErrors,
          });

          errors.push(opErrors);
        });
      }

      setOperationsError([...errors]);
    }
    // Check this only when mounts, don't need to check any dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update operations error when operations change
  useEffect(() => {
    setBuildOperationsError(getOperationsError());
    // Not including getOperationsError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    txnOperations,
    sorobanOperation.operation_type,
    operationsError,
    setBuildOperationsError,
  ]);

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

  const operationCustomMessage = ({
    opType,
    opIndex,
    opError,
  }: {
    opType: string;
    opIndex: number;
    opError: OperationError;
  }) => {
    if (opType === OP_SET_TRUST_LINE_FLAGS) {
      const setTrustLineFlagsOp = txnOperations[opIndex];

      if (
        !(
          setTrustLineFlagsOp?.params.set_flags ||
          setTrustLineFlagsOp?.params.clear_flags
        )
      ) {
        return {
          ...opError,
          customMessage: [SET_TRUSTLINE_FLAGS_CUSTOM_MESSAGE],
        };
      }
    }

    return opError;
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
      customMessage: opError.customMessage,
    };
  };

  const handleOperationSourceAccountChange = (
    opIndex: number,
    opValue: any,
    opType: string,
    isSoroban: boolean = false,
  ) => {
    if (isSoroban) {
      // Handle Soroban operation
      updateSorobanBuildOperation({
        ...sorobanOperation,
        source_account: opValue,
      });
    } else {
      // Handle classic operation
      const op = txnOperations[opIndex];
      updateBuildSingleOperation(opIndex, {
        ...op,
        source_account: opValue,
      });
    }

    // Validation logic is the same for both
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
      const hasCustomMessage = op.customMessage.length > 0;

      const opErrors: OpBuildingError = {};

      if (
        !op.operationType ||
        hasErrors ||
        hasMissingFields ||
        hasCustomMessage
      ) {
        const opLabel = TRANSACTION_OPERATIONS[op.operationType]?.label;
        opErrors.label = `Operation #${idx}${opLabel ? `: ${opLabel}` : ""}`;
        opErrors.errorList = [];

        if (!op.operationType) {
          opErrors.errorList.push("Select operation type");
        }

        if (hasMissingFields) {
          opErrors.errorList.push("Fill out all required fields");
        }

        if (hasCustomMessage) {
          op.customMessage.forEach((cm) => {
            opErrors.errorList?.push(cm);
          });
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

  const renderSourceAccount = (opType: string, index: number) => {
    const currentOperation = isSorobanOperationType(opType)
      ? sorobanOperation
      : txnOperations[index];

    const sourceAccountComponent = formComponentTemplateTxnOps({
      param: "source_account",
      opType,
      index,
    });

    return opType && sourceAccountComponent
      ? sourceAccountComponent.render({
          value: currentOperation.source_account,
          error: operationsError[index]?.error?.["source_account"],
          isRequired: false,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            handleOperationSourceAccountChange(
              index,
              e.target.value,
              opType,
              isSorobanOperationType(opType),
            );
          },
        })
      : null;
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
          infoLink="https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations"
          onChange={(e) => {
            const defaultParams =
              TRANSACTION_OPERATIONS[e.target.value]?.defaultParams || {};
            const defaultParamKeys = Object.keys(defaultParams);
            const newOpType = e.target.value;

            if (isSorobanOperationType(newOpType)) {
              // reset both the soroban and classic operation
              // we reset soroban operation because its invoke host function
              // will have a nested operation
              updateBuildOperations([INITIAL_OPERATION]);

              resetSorobanOperation();
              updateOptionParamAndError({ type: "reset" });
              updateSorobanBuildOperation({
                operation_type: newOpType,
                params: defaultParams,
                source_account: "",
              });
            } else {
              // if it's classic, reset the soroban operation
              resetSorobanOperation();
              updateBuildSingleOperation(index, {
                operation_type: newOpType,
                params: defaultParams,
                source_account: "",
              });
            }

            let initParamError: OperationError = EMPTY_OPERATION_ERROR;

            // Get operation required fields if there is operation type
            if (newOpType) {
              const missingFields = [
                ...(TRANSACTION_OPERATIONS[newOpType]?.requiredParams || []),
              ].reduce((missingRes: string[], reqItem) => {
                if (!defaultParamKeys.includes(reqItem)) {
                  return [...missingRes, reqItem];
                }

                return missingRes;
              }, []);

              initParamError = {
                ...initParamError,
                missingFields,
                operationType: newOpType,
              };

              initParamError = operationCustomMessage({
                opType: newOpType,
                opIndex: index,
                opError: initParamError,
              });
            }

            if (isSorobanOperationType(newOpType)) {
              // for soroban, on operation dropdown change, we don't need to update the existing array
              // since there is only one operation
              setOperationsError([initParamError]);
            } else {
              setOperationsError([
                ...arrayItem.update(operationsError, index, initParamError),
              ]);
            }

            trackEvent(TrackingEvent.TRANSACTION_BUILD_OPERATIONS_OP_TYPE, {
              txType: isSorobanOperationType(newOpType)
                ? "smart contract"
                : "classic",
              operationType: newOpType,
            });
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
          <option value="extend_footprint_ttl">
            [Smart Contract] Extend Footprint TTL
          </option>
          <option value="restore_footprint">
            [Smart Contract] Restore Footprint
          </option>
          <option value="invoke_contract_function">
            [Smart Contract] Invoke Contract Function **Experimental**
          </option>
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

  /* Soroban Operations */
  // Unlike classic transactions, Soroban tx can only have one operation
  if (soroban.operation.operation_type) {
    return (
      <SorobanOperation
        operationTypeSelector={
          <OperationTypeSelector
            index={0}
            operationType={soroban.operation.operation_type}
          />
        }
        operationsError={operationsError}
        setOperationsError={setOperationsError}
        validateOperationParam={validateOperationParam}
        renderSourceAccount={renderSourceAccount}
      />
    );
  }

  return (
    <ClassicOperation
      operationTypeSelector={OperationTypeSelector}
      operationsError={operationsError}
      setOperationsError={setOperationsError}
      updateOptionParamAndError={updateOptionParamAndError}
      validateOperationParam={validateOperationParam}
      renderSourceAccount={renderSourceAccount}
    />
  );
};
