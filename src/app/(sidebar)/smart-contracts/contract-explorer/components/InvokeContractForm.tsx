import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Card,
  Select,
  Text,
  Textarea,
  Badge,
  Icon,
  Tooltip,
} from "@stellar/design-system";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { Api } from "@stellar/stellar-sdk/rpc";
import { JSONSchema7 } from "json-schema";

import { RpcErrorResponse } from "@/components/TxErrorResponse";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { JsonSchemaRenderer } from "@/components/SmartContractJsonSchema/JsonSchemaRenderer";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { TransactionSuccessCard } from "@/components/TransactionSuccessCard";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";
import { useSimulateTx } from "@/query/useSimulateTx";
import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";

import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";

import { SorobanInvokeValue, XdrFormatType, AnyObject } from "@/types/types";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const InvokeContractForm = ({
  contractId,
  funcName,
  contractSpec,
}: {
  contractId: string;
  funcName: string;
  contractSpec: contract.Spec;
}) => {
  const { network, walletKit } = useStore();
  const [invokeError, setInvokeError] = useState<{
    message: string;
    methodType: string;
  } | null>(null);
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType>("json");
  const [formValue, setFormValue] = useState<SorobanInvokeValue>({
    contract_id: contractId,
    function_name: funcName,
    args: {},
  });
  const [formError, setFormError] = useState<AnyObject>({});
  const [isGetFunction, setIsGetFunction] = useState(false);
  // Based on reads and writes to the contract
  // Can only be determined based on the simulation result
  const [isWriteFn, setIsWriteFn] = useState<boolean | undefined>(undefined);
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchemaType | null>(null);
  const [isBadgeTooltipVisible, setIsBadgeTooltipVisible] = useState(false);
  const hasNoFormErrors = isEmptyObject(formError);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (buttonRef?.current?.contains(event.target as Node)) {
      return;
    }

    setIsBadgeTooltipVisible(false);
  }, []);

  // Close tooltip when clicked outside
  useLayoutEffect(() => {
    if (isBadgeTooltipVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [handleClickOutside, isBadgeTooltipVisible]);

  const {
    data: sequenceNumberData,
    isFetching: isFetchingSequenceNumber,
    isLoading: isLoadingSequenceNumber,
    refetch: fetchSequenceNumber,
    error: sequenceNumberError,
  } = useAccountSequenceNumber({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
    uniqueId: funcName,
    enabled: !!walletKit?.publicKey,
  });

  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    isError: isSimulateTxError,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  const {
    mutateAsync: prepareTx,
    isPending: isPrepareTxPending,
    reset: resetPrepareTx,
  } = useRpcPrepareTx();

  const {
    data: submitRpcResponse,
    mutate: submitRpc,
    error: submitRpcError,
    isPending: isSubmitRpcPending,
    isSuccess: isSubmitRpcSuccess,
    isError: isSubmitRpcError,
    reset: resetSubmitRpc,
  } = useSubmitRpcTx();

  const walletKitInstance = useContext(WalletKitContext);

  const IS_BLOCK_EXPLORER_ENABLED =
    network.id === "testnet" || network.id === "mainnet";

  const [isCodeWrapped, setIsCodeWrapped] = useCodeWrappedSetting();

  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const responseErrorEl = useRef<HTMLDivElement | null>(null);

  const signTx = async (xdr: string): Promise<string | null> => {
    if (!walletKitInstance?.walletKit || !walletKit?.publicKey) {
      return null;
    }

    let timeout: NodeJS.Timeout | null = null;

    setIsExtensionLoading(true);

    if (walletKit?.publicKey) {
      try {
        // Add timeout to prevent endless loading
        // when user exits out of the extension
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            reject(
              new Error("Transaction signing timed out. Please try again."),
            );
          }, 20000);
        });

        const signPromise = walletKitInstance.walletKit.signTransaction(
          xdr || "",
          {
            address: walletKit.publicKey,
            networkPassphrase: network.passphrase,
          },
        );

        const result = await Promise.race([signPromise, timeoutPromise]);

        if (result.signedTxXdr && result.signedTxXdr !== "") {
          return result.signedTxXdr;
        }
      } catch (error: any) {
        if (error?.message) {
          setInvokeError({ message: error?.message, methodType: "Sign" });
        }
      } finally {
        setIsExtensionLoading(false);

        if (timeout) {
          clearTimeout(timeout);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (isSubmitRpcSuccess) {
      trackEvent(
        TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT_SUCCESS,
        {
          funcName: formValue.function_name,
        },
      );
    }
  }, [isSubmitRpcSuccess, formValue.function_name]);

  useEffect(() => {
    if (isSubmitRpcError) {
      trackEvent(
        TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT_ERROR,
        {
          funcName: formValue.function_name,
        },
      );
    }
  }, [isSubmitRpcError, formValue.function_name]);

  useEffect(() => {
    if (contractSpec) {
      const schema = dereferenceSchema(
        contractSpec?.jsonSchema(funcName) as JSONSchema7,
        funcName,
      );

      setDereferencedSchema(schema);
    }
  }, [contractSpec, funcName]);

  useEffect(() => {
    const isSuccessfulSimulation =
      simulateTxData && Boolean(!simulateTxData?.result?.error);

    const isFailedSimulation =
      simulateTxData && Boolean(simulateTxData?.result.error);

    if (isSuccessfulSimulation) {
      const result =
        simulateTxData.result as Api.RawSimulateTransactionResponse;
      const simulationChangesState =
        result.stateChanges && result.stateChanges.length > 0;

      setIsWriteFn(Boolean(simulationChangesState));
      return;
    }

    if (isFailedSimulation) {
      setIsWriteFn(undefined);
    }
  }, [simulateTxData]);

  const handleChange = (value: SorobanInvokeValue) => {
    setInvokeError(null);
    setFormValue(value);
  };

  const isSimulating =
    isLoadingSequenceNumber ||
    isFetchingSequenceNumber ||
    isSimulateTxPending ||
    isPrepareTxPending;

  const resetSubmitState = () => {
    if (submitRpcError || submitRpcResponse) {
      resetSubmitRpc();
    }
  };

  const resetSimulateState = () => {
    if (isSimulateTxError || simulateTxData?.result) {
      resetSimulateTx();
    }
  };

  const handleSimulateAndSubmit = async () => {
    const xdr = await getXdrToSimulate();

    if (xdr) {
      await handleSimulate(xdr);
      const prepareResult = await handlePrepareTx(xdr);

      if (prepareResult?.transactionXdr) {
        await handleSubmit(prepareResult.transactionXdr);
      }
    }
  };

  const getXdrToSimulate = async () => {
    reset();

    try {
      const sequenceResult = await fetchSequenceNumber();

      if (!sequenceResult?.data || sequenceNumberError) {
        const errorMessage =
          sequenceNumberError ||
          "Failed to fetch sequence number. Please try again.";

        throw errorMessage;
      }

      trackEvent(
        TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE,
        {
          funcName: formValue.function_name,
        },
      );

      const txnParams: TransactionBuildParams = {
        source_account: walletKit?.publicKey || "",
        fee: BASE_FEE,
        seq_num: sequenceResult?.data || sequenceNumberData || "",
        cond: {
          time: {
            min_time: "0",
            max_time: "0",
          },
        },
        memo: {},
      };

      const sorobanOperation = {
        operation_type: "invoke_contract_function",
        params: {
          contract_id: formValue.contract_id,
          function_name: formValue.function_name,
          args: formValue.args,
        },
      };

      const { xdr, error } = getTxnToSimulate(
        formValue,
        txnParams,
        sorobanOperation,
        network.passphrase,
      );

      if (xdr) {
        return xdr;
      }

      if (error) {
        setInvokeError({ message: error, methodType: "Get TX to Simulate" });
      }

      return null;
    } catch (error: any) {
      setInvokeError({
        message: error,
        methodType: "Get TX to Simulate",
      });
      return null;
    }
  };

  const handleSimulate = async (xdr: string) => {
    try {
      await simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        headers: getNetworkHeaders(network, "rpc"),
        xdrFormat,
      });

      trackEvent(
        TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE_SUCCESS,
        {
          funcName: formValue.function_name,
        },
      );
    } catch (error: any) {
      setInvokeError({
        message: error?.message || "Failed to simulate transaction",
        methodType: "Simulate",
      });
    }
  };

  const handlePrepareTx = async (xdr: string) => {
    if (!xdr) {
      return null;
    }

    try {
      const prepareResult = await prepareTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });

      return prepareResult;
    } catch (error: any) {
      setInvokeError({
        message: error?.message || "Failed to prepare transaction",
        methodType: "Prepare",
      });
      return null;
    }
  };

  const handleSubmit = async (xdr: string) => {
    if (!xdr) {
      setInvokeError({
        message: "No transaction data available to sign",
        methodType: "Submit",
      });
      return;
    }

    resetSimulateState();
    resetSubmitState();

    trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT, {
      funcName: formValue.function_name,
    });

    try {
      const signedTxXdr = await signTx(xdr);

      if (!signedTxXdr) {
        throw new Error(
          "Transaction signing failed - no signed transaction received",
        );
      }

      submitRpc({
        rpcUrl: network.rpcUrl,
        transactionXdr: signedTxXdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    } catch (error: any) {
      setInvokeError({
        message: error?.message || "Failed to sign transaction",
        methodType: "Submit",
      });
    }
  };

  const reset = () => {
    setInvokeError(null);
    resetSimulateState();
    resetSubmitState();
    resetPrepareTx();
  };

  const renderTitle = (name: string, description?: string) => (
    <>
      <Box gap="sm" direction="row">
        <Text size="sm" as="div" weight="bold">
          {name}
        </Text>
        {renderReadWriteBadge(isWriteFn)}
      </Box>
      {description ? (
        <Textarea
          id={`invoke-contract-description-${name}`}
          fieldSize="md"
          disabled
          rows={description.length > 100 ? 7 : 1}
          value={description}
          spellCheck="false"
        >
          {description}
        </Textarea>
      ) : null}
    </>
  );

  useEffect(() => {
    if (dereferencedSchema && !dereferencedSchema?.required.length) {
      setIsGetFunction(true);
    } else {
      setIsGetFunction(false);
    }
  }, [dereferencedSchema]);

  const renderReadWriteBadge = (isWriteFn: boolean | undefined) => {
    if (isWriteFn === undefined) return null;

    const badge = (
      <button
        ref={buttonRef}
        className="ContractInfo__badgeButton"
        onClick={() => {
          setIsBadgeTooltipVisible(!isBadgeTooltipVisible);
        }}
        type="button"
      >
        <Badge
          icon={isWriteFn ? <Icon.Pencil01 /> : <Icon.Eye />}
          variant={isWriteFn ? "secondary" : "success"}
          iconPosition="left"
        >
          {isWriteFn ? "Write" : "Read"}
        </Badge>
      </button>
    );

    return !isWriteFn ? (
      <div style={{ cursor: "pointer" }}>
        <Tooltip
          isVisible={isBadgeTooltipVisible}
          isContrast
          title="Read Only"
          placement="right-end"
          triggerEl={badge}
        >
          {`When a transaction doesn't change the state of the contract, it is
               considered a read operation. \nIn this scenario, it is not
               necessary to submit the transaction to the network, as it does not
               modify any data. \nYou can simply simulate the transaction to see
               the results without incurring any costs.`}
        </Tooltip>
      </div>
    ) : (
      badge
    );
  };

  const renderSchema = () => {
    if (!contractSpec || !dereferencedSchema) {
      return null;
    }

    return (
      <Box gap="md">
        {renderTitle(funcName, dereferencedSchema?.description)}
        {formValue.contract_id &&
          formValue.function_name &&
          dereferencedSchema && (
            <JsonSchemaRenderer
              formError={formError}
              setFormError={setFormError}
              name={funcName}
              schema={dereferencedSchema as JSONSchema7}
              onChange={handleChange}
              parsedSorobanOperation={formValue}
            />
          )}
      </Box>
    );
  };

  const renderResponse = () => {
    const { result: simulateResult } = simulateTxData || {};
    const { result: submitResult } = submitRpcResponse || {};

    const result = simulateResult || submitResult;

    if (result) {
      return (
        <Box gap="md">
          <div
            data-testid="invoke-contract-simulate-tx-response"
            className={`PageBody__content PageBody__scrollable ${result?.error ? "PageBody__content--error" : ""}`}
          >
            <PrettyJsonTransaction
              json={result}
              xdr={result?.xdr}
              isCodeWrapped={isCodeWrapped}
            />
          </div>
          <Box gap="md" direction="row" align="center">
            <JsonCodeWrapToggle
              isChecked={isCodeWrapped}
              onChange={(isChecked) => {
                setIsCodeWrapped(isChecked);
              }}
            />
          </Box>
        </Box>
      );
    }

    return null;
  };

  const renderSuccess = () => {
    if (isSubmitRpcSuccess && submitRpcResponse && network.id) {
      return (
        <div ref={responseSuccessEl}>
          <TransactionSuccessCard
            response={submitRpcResponse}
            network={network.id}
            isBlockExplorerEnabled={IS_BLOCK_EXPLORER_ENABLED}
          />
        </div>
      );
    }

    return null;
  };

  const renderError = () => {
    if (submitRpcError) {
      return (
        <div ref={responseErrorEl}>
          <RpcErrorResponse error={submitRpcError} />
        </div>
      );
    }

    if (invokeError?.message) {
      return (
        <div ref={responseErrorEl}>
          <ErrorText
            errorMessage={`${invokeError.methodType}: ${invokeError.message}`}
            size="sm"
          />
        </div>
      );
    }

    return null;
  };

  /*
    isSubmitDisabled is true if:
    - there is an invoke error from simulation or signing
    - there is a submit rpc error
    - the transaction is simulating
    - the wallet is not connected
    - there are form validation errors
    - the transaction data from simulation is not available (needed to submit)
  */

  const simulatedResultResponse =
    simulateTxData?.result?.transactionData ||
    simulateTxData?.result?.transactionDataJson;

  const isSubmitDisabled =
    !!invokeError?.message ||
    isSubmitRpcError ||
    isSimulating ||
    !walletKit?.publicKey ||
    !hasNoFormErrors ||
    !simulatedResultResponse;

  const isSimulationDisabled = () => {
    const currentKey = Object.keys(formValue.args)[0];
    const isEmptyArgs =
      isEmptyObject(formValue.args) || formValue.args[currentKey]?.value === "";

    const disabled = !isGetFunction && isEmptyArgs;

    return !walletKit?.publicKey || !hasNoFormErrors || disabled;
  };

  return (
    <Card>
      <div className="ContractInvoke">
        <Box gap="md">
          {renderSchema()}

          <Box gap="sm" direction="row" align="end" justify="end" wrap="wrap">
            <Box gap="sm" direction="row" align="end" justify="end" wrap="wrap">
              <Select
                id="simulate-tx-xdr-format"
                fieldSize="md"
                value={xdrFormat}
                onChange={(e) => {
                  setXdrFormat(e.target.value as XdrFormatType);
                }}
              >
                <option value="base64">XDR Format: Base64</option>
                <option value="json">XDR Format: JSON</option>
              </Select>
            </Box>

            <Button
              size="md"
              variant="tertiary"
              disabled={isSimulationDisabled()}
              isLoading={isSimulating}
              onClick={async () => {
                const xdr = await getXdrToSimulate();

                if (xdr) {
                  await handleSimulate(xdr);
                  await handlePrepareTx(xdr);
                }
              }}
            >
              Simulate
            </Button>

            <Button
              size="md"
              variant="secondary"
              isLoading={isExtensionLoading || isSubmitRpcPending}
              disabled={isSubmitDisabled}
              onClick={handleSimulateAndSubmit}
            >
              Simulate & Submit
            </Button>
          </Box>

          <>{renderResponse()}</>
          <>{renderSuccess()}</>
          <>{renderError()}</>
        </Box>
      </div>
    </Card>
  );
};
