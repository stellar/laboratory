import { ChangeEvent, Fragment, useState } from "react";
import { Card, Badge, Button, Icon, Input } from "@stellar/design-system";

import { TabbedButtons } from "@/components/TabbedButtons";
import { Box } from "@/components/layout/Box";
import { formComponentTemplateTxnOps } from "@/components/formComponentTemplateTxnOps";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import { arrayItem } from "@/helpers/arrayItem";
import { getClaimableBalanceIdFromXdr } from "@/helpers/getClaimableBalanceIdFromXdr";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { shareableUrl } from "@/helpers/shareableUrl";
import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";

import { useStore } from "@/store/useStore";

import { OP_SET_TRUST_LINE_FLAGS } from "@/constants/settings";
import {
  INITIAL_OPERATION,
  SET_TRUSTLINE_FLAGS_CUSTOM_MESSAGE,
  TRANSACTION_OPERATIONS,
} from "@/constants/transactionOperations";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  AnyObject,
  AssetObject,
  AssetObjectValue,
  AssetPoolShareObjectValue,
  NumberFractionValue,
  OperationError,
  OptionSigner,
  RevokeSponsorshipValue,
} from "@/types/types";

export const ClassicOperation = ({
  operationTypeSelector: OperationTypeSelector,
  operationsError,
  setOperationsError,
  updateOptionParamAndError,
  validateOperationParam,
  renderSourceAccount,
}: {
  operationTypeSelector: React.ComponentType<{
    index: number;
    operationType: string;
  }>;
  operationsError: OperationError[];
  setOperationsError: (operationsError: OperationError[]) => void;
  updateOptionParamAndError: (params: {
    type:
      | "add"
      | "delete"
      | "move-before"
      | "move-after"
      | "duplicate"
      | "reset";
    index?: number;
    item?: any;
  }) => void;
  validateOperationParam: (params: {
    opIndex: number;
    opParam: string;
    opValue: any;
    opType: string;
  }) => OperationError;
  renderSourceAccount: (opType: string, index: number) => React.ReactNode;
}) => {
  const { transaction, network } = useStore();
  const { classic } = transaction.build;
  const { operations: txnOperations, xdr: txnXdr } = classic;

  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);

  const { updateBuildSingleOperation } = transaction;

  /* Classic Operations */
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
            onClick: () => {
              updateOptionParamAndError({
                type: "move-before",
                index,
              });

              trackEvent(TrackingEvent.TRANSACTION_BUILD_OPERATIONS_ACTION_UP, {
                txType: "classic",
              });
            },
            isDisabled: isUpDisabled,
          },
          {
            id: "moveDown",
            hoverTitle: "Move down",
            icon: <Icon.ArrowDown />,
            onClick: () => {
              updateOptionParamAndError({
                type: "move-after",
                index,
              });

              trackEvent(
                TrackingEvent.TRANSACTION_BUILD_OPERATIONS_ACTION_DOWN,
                {
                  txType: "classic",
                },
              );
            },
            isDisabled: isDownDisabled,
          },
          {
            id: "duplicate",
            hoverTitle: "Duplicate",
            icon: <Icon.Copy07 />,
            onClick: () => {
              updateOptionParamAndError({
                type: "duplicate",
                index,
              });

              trackEvent(
                TrackingEvent.TRANSACTION_BUILD_OPERATIONS_ACTION_DUPLICATE,
                {
                  txType: "classic",
                },
              );
            },
          },
          {
            id: "delete",
            hoverTitle: "Delete",
            icon: <Icon.Trash01 />,
            isError: true,
            isDisabled: isDeleteDisabled,
            onClick: () => {
              updateOptionParamAndError({
                type: "delete",
                index,
              });

              trackEvent(
                TrackingEvent.TRANSACTION_BUILD_OPERATIONS_ACTION_DELETE,
                {
                  txType: "classic",
                },
              );
            },
          },
        ]}
      />
    );
  };

  const renderClaimableBalanceId = (opIndex: number) => {
    const balanceId = getClaimableBalanceIdFromXdr({
      xdr: txnXdr,
      networkPassphrase: network.passphrase,
      opIndex,
    });

    if (!balanceId) {
      return null;
    }

    return (
      <Input
        id={`${opIndex}-create_claimable_balance`}
        label="Claimable Balance ID"
        labelSuffix="generated"
        fieldSize="md"
        value={balanceId}
        disabled
        copyButton={{ position: "right" }}
        infoLink="https://developers.stellar.org/docs/learn/glossary#claimablebalanceid"
      />
    );
  };

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
                data-testid={`build-transaction-operation-${idx}`}
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
                    variant="secondary"
                  >{`Operation ${idx}`}</Badge>

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
                            return (
                              <Fragment key={`op-${idx}-claimants-wrapper`}>
                                {component.render({
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
                                })}

                                {renderClaimableBalanceId(idx)}
                              </Fragment>
                            );
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
                                  opValue: value.length > 0 ? value : undefined,
                                  opType: op.operation_type,
                                });

                                if (
                                  op.operation_type === OP_SET_TRUST_LINE_FLAGS
                                ) {
                                  const txOp = txnOperations[idx];

                                  // If checking a flag, remove the message (the
                                  // other flag doesn't matter).
                                  // If unchecking a flag, check if the other
                                  // flag is checked.
                                  const showCustomMessage =
                                    value.length > 0
                                      ? false
                                      : input === "clear_flags"
                                        ? !txOp.params.set_flags
                                        : !txOp.params.clear_flags;

                                  const opError = {
                                    ...operationsError[idx],
                                    customMessage: showCustomMessage
                                      ? [SET_TRUSTLINE_FLAGS_CUSTOM_MESSAGE]
                                      : [],
                                  };
                                  const updated = arrayItem.update(
                                    operationsError,
                                    idx,
                                    opError,
                                  );

                                  setOperationsError(updated);
                                }
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
          <Box
            gap="lg"
            direction="row"
            align="center"
            justify="space-between"
            addlClassName="Operation__buttons"
          >
            <Box gap="sm" direction="row" align="center">
              <Button
                size="md"
                variant="tertiary"
                icon={<Icon.PlusCircle />}
                onClick={() => {
                  updateOptionParamAndError({
                    type: "add",
                    item: INITIAL_OPERATION,
                  });

                  trackEvent(TrackingEvent.TRANSACTION_BUILD_ADD_OPERATION, {
                    txType: "classic",
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
                disabled={!txnXdr}
              ></Button>

              <ShareUrlButton
                shareableUrl={shareableUrl("transactions-build")}
              />
            </Box>

            <Button
              size="md"
              variant="error"
              icon={<Icon.RefreshCw01 />}
              onClick={() => {
                updateOptionParamAndError({ type: "reset" });
                trackEvent(TrackingEvent.TRANSACTION_BUILD_OPERATIONS_CLEAR, {
                  txType: "classic",
                });
              }}
            >
              Clear Operations
            </Button>
          </Box>
        </Box>
      </Card>

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Transaction"
        itemProps={{
          xdr: txnXdr,
          page: "build",
          shareableUrl: shareableUrl("transactions-build"),
          params: transaction.build.params,
          operations: transaction.build.classic.operations,
        }}
        allSavedItems={localStorageSavedTransactions.get()}
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedTransactions.set(updatedItems);

          trackEvent(TrackingEvent.TRANSACTION_BUILD_SAVE, {
            txType: "classic",
          });
        }}
      />
    </Box>
  );
};
