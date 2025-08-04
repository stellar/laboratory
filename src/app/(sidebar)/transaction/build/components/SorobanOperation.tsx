import { ChangeEvent, useState } from "react";

import {
  Badge,
  Button,
  Card,
  Icon,
  Notification,
} from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { formComponentTemplateTxnOps } from "@/components/formComponentTemplateTxnOps";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { ErrorText } from "@/components/ErrorText";

import { localStorageSavedTransactions } from "@/helpers/localStorageSavedTransactions";
import { shareableUrl } from "@/helpers/shareableUrl";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getTxWithSorobanData } from "@/helpers/sorobanUtils";
import { sanitizeObject } from "@/helpers/sanitizeObject";

import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";

import {
  EMPTY_OPERATION_ERROR,
  INITIAL_OPERATION,
  TRANSACTION_OPERATIONS,
} from "@/constants/transactionOperations";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { OperationError, SorobanInvokeValue } from "@/types/types";

export const SorobanOperation = ({
  operationTypeSelector,
  operationsError,
  setOperationsError,
  validateOperationParam,
  renderSourceAccount,
}: {
  operationTypeSelector: React.ReactElement;
  operationsError: OperationError[];
  setOperationsError: (operationsError: OperationError[]) => void;
  validateOperationParam: (params: {
    opIndex: number;
    opParam: string;
    opValue: any;
    opType: string;
  }) => OperationError;
  renderSourceAccount: (opType: string, index: number) => React.ReactNode;
}) => {
  const { transaction, network } = useStore();
  const { soroban, params: txnParams } = transaction.build;
  const { operation: sorobanOperation, xdr: sorobanTxnXdr } = soroban;
  const { updateSorobanBuildOperation, updateSorobanBuildXdr } = transaction;

  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutateAsync: prepareTx,
    isPending: isPrepareTxPending,
    reset: resetPrepareTx,
  } = useRpcPrepareTx();

  const prepareSorobanTx = async () => {
    resetPrepareTx();
    setErrorMessage("");

    try {
      const sorobanTx = getTxWithSorobanData({
        operation: sorobanOperation,
        txnParams,
        networkPassphrase: network.passphrase,
      });

      const preparedTx = await prepareTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: sorobanTx.xdr,
        headers: getNetworkHeaders(network, "rpc"),
        networkPassphrase: network.passphrase,
      });

      if (preparedTx.transactionXdr) {
        updateSorobanBuildXdr(preparedTx.transactionXdr);
      }
    } catch (e: any) {
      setErrorMessage(e?.result?.message || "Failed to prepare transaction");
      updateSorobanBuildXdr("");
    }
  };

  const resetSorobanOperation = () => {
    updateSorobanBuildOperation(INITIAL_OPERATION);
    setOperationsError([EMPTY_OPERATION_ERROR]);
  };

  const handleSorobanOperationParamChange = ({
    opParam,
    opValue,
    opType,
  }: {
    opParam: string;
    opValue: any;
    opType: string;
  }) => {
    const updatedOperation = {
      ...sorobanOperation,
      operation_type: opType,
      params: sanitizeObject({
        ...sorobanOperation?.params,
        [opParam]: opValue,
      }),
    };

    updateSorobanBuildOperation(updatedOperation);

    // Validate the parameter
    const validatedOpParam = validateOperationParam({
      opIndex: 0, // setting index to 0 because only one operation is allowed with Soroban
      opParam,
      opValue,
      opType,
    });

    setOperationsError([validatedOpParam]);
  };

  return (
    <Box gap="md">
      <Card>
        <Box gap="lg">
          <Box
            key="op"
            gap="lg"
            addlClassName="PageBody__content"
            data-testid="build-soroban-transaction-operation"
          >
            {/* Operation label and action buttons */}
            <Box
              gap="lg"
              direction="row"
              align="center"
              justify="space-between"
            >
              <Badge size="md" variant="secondary">
                Operation
              </Badge>
            </Box>

            {operationTypeSelector}

            {/* RPC URL Validation */}
            <>
              {!network.rpcUrl ? (
                <Box gap="sm" direction="row" align="center">
                  <Notification
                    variant="error"
                    title="Network Configuration Required"
                  >
                    An RPC URL must be configured in the network settings to
                    proceed with a Soroban operation.
                  </Notification>
                </Box>
              ) : null}
            </>

            {/* Operation params */}
            <>
              {TRANSACTION_OPERATIONS[
                sorobanOperation.operation_type
              ]?.params.map((input) => {
                const component = formComponentTemplateTxnOps({
                  param: input,
                  opType: sorobanOperation.operation_type,
                  index: 0, // no index for soroban operations
                  custom:
                    TRANSACTION_OPERATIONS[sorobanOperation.operation_type]
                      .custom?.[input],
                });

                // Soroban base props
                const sorobanBaseProps = {
                  key: input,
                  value: sorobanOperation.params[input],
                  error: operationsError[0]?.error?.[input],
                  isRequired:
                    TRANSACTION_OPERATIONS[
                      sorobanOperation.operation_type
                    ].requiredParams.includes(input),
                  isDisabled: Boolean(!network.rpcUrl),
                };

                if (component) {
                  switch (input) {
                    case "contract":
                    case "key_xdr":
                    case "extend_ttl_to":
                    case "resource_fee":
                    case "durability":
                      return (
                        <div key={`soroban-param-${input}`}>
                          {component.render({
                            ...sorobanBaseProps,
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              handleSorobanOperationParamChange({
                                opParam: input,
                                opValue: e.target.value,
                                opType: sorobanOperation.operation_type,
                              });
                            },
                          })}
                        </div>
                      );
                    case "invoke_contract":
                      return (
                        <div key={`soroban-param-${input}`}>
                          {component.render({
                            ...sorobanBaseProps,
                            onChange: (value: SorobanInvokeValue) => {
                              handleSorobanOperationParamChange({
                                opParam: input,
                                // invoke_contract has a nested object within params
                                // { contract_id: "", data: {} }
                                // we need to stringify the nested object
                                // for zustand querystring to properly save the value in the url
                                opValue: value
                                  ? JSON.stringify(value)
                                  : undefined,
                                opType: sorobanOperation.operation_type,
                              });
                            },
                          })}
                        </div>
                      );
                    default:
                      return (
                        <div key={`soroban-param-${input}`}>
                          {component.render({
                            ...sorobanBaseProps,
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              handleSorobanOperationParamChange({
                                opParam: input,
                                opValue: e.target.value,
                                opType: sorobanOperation.operation_type,
                              });
                            },
                          })}
                        </div>
                      );
                  }
                }

                return null;
              })}
            </>

            {/* Optional source account for Soroban operations */}
            <>{renderSourceAccount(sorobanOperation.operation_type, 0)}</>
          </Box>

          {sorobanOperation.operation_type !== "invoke_contract" && (
            <Box gap="sm" direction="row" align="center">
              <Button
                disabled={Boolean(!network.rpcUrl)}
                isLoading={isPrepareTxPending}
                size="md"
                variant="secondary"
                onClick={prepareSorobanTx}
              >
                Prepare Soroban Transaction to Sign
              </Button>

              {errorMessage && (
                <ErrorText errorMessage={errorMessage} size="sm" />
              )}
            </Box>
          )}

          <Box gap="sm" direction="row" align="center">
            <Notification variant="warning" title="Only One Operation Allowed">
              Note that Soroban transactions can only contain one operation per
              transaction.
            </Notification>
          </Box>

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
                // Only one operation allowed for Soroban
                disabled={true}
                icon={<Icon.PlusCircle />}
                onClick={() => {
                  /* noop*/
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
                disabled={!sorobanTxnXdr}
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
                resetSorobanOperation();
                trackEvent(TrackingEvent.TRANSACTION_BUILD_ADD_OPERATION, {
                  txType: "smart contract",
                });
              }}
            >
              Clear Operation
            </Button>
          </Box>
        </Box>
      </Card>

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Transaction"
        itemProps={{
          xdr: sorobanTxnXdr,
          page: "build",
          shareableUrl: shareableUrl("transactions-build"),
          params: transaction.build.params,
          operations: [transaction.build.soroban.operation],
        }}
        allSavedItems={localStorageSavedTransactions.get()}
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedTransactions.set(updatedItems);

          trackEvent(TrackingEvent.TRANSACTION_BUILD_SAVE, {
            txType: "smart contract",
          });
        }}
      />
    </Box>
  );
};
