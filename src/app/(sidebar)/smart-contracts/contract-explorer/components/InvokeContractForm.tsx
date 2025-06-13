import { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Select, Text, Textarea } from "@stellar/design-system";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { JSONSchema7 } from "json-schema";

import { RpcErrorResponse } from "@/app/(sidebar)/transaction/submit/components/ErrorResponse";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { JsonSchemaRenderer } from "@/components/SmartContractJsonSchema/JsonSchemaRenderer";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { TransactionSuccessCard } from "@/components/TransactionSuccessCard";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";
import { useFormError } from "@/components/SmartContractJsonSchema/FormErrorContext";

import { TransactionBuildParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";
import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { useRpcPrepareTx } from "@/query/useRpcPrepareTx";
import { useSimulateTx } from "@/query/useSimulateTx";
import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";
import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { getWasmContractData } from "@/helpers/getWasmContractData";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";

import {
  ContractInfoApiResponse,
  Network,
  SorobanInvokeValue,
  EmptyObj,
  XdrFormatType,
} from "@/types/types";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const InvokeContractForm = ({
  infoData,
  network,
  funcName,
}: {
  infoData: ContractInfoApiResponse;
  network: Network | EmptyObj;
  funcName: string;
}) => {
  const { walletKit } = useStore();
  const [contractSpec, setContractSpec] = useState<contract.Spec | null>();
  const [invokeError, setInvokeError] = useState<{
    message: string;
    methodType: string;
  } | null>(null);
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType>("json");
  const [formValue, setFormValue] = useState<SorobanInvokeValue>({
    contract_id: infoData.contract,
    function_name: funcName,
    args: {},
  });
  const { formError } = useFormError();
  const [isGetFunction, setIsGetFunction] = useState(false);
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchemaType | null>(null);

  const hasNoFormErrors = isEmptyObject(formError);

  const { wasm: wasmHash } = infoData;

  const {
    data: sequenceNumberData,
    isFetching: isFetchingSequenceNumber,
    isLoading: isLoadingSequenceNumber,
    refetch: fetchSequenceNumber,
  } = useAccountSequenceNumber({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
    uniqueId: funcName,
    enabled: !!walletKit?.publicKey,
  });

  const {
    mutate: simulateTx,
    data: simulateTxData,
    isError: isSimulateTxError,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  const {
    mutate: prepareTx,
    isPending: isPrepareTxPending,
    data: prepareTxData,
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

  const { data: wasmBinary } = useWasmBinaryFromRpc({
    wasmHash: wasmHash || "",
    rpcUrl: network.rpcUrl || "",
    isActive: Boolean(network.passphrase && wasmHash),
  });

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

    setIsExtensionLoading(true);

    if (walletKit?.publicKey) {
      try {
        const result = await walletKitInstance.walletKit.signTransaction(
          xdr || "",
          {
            address: walletKit.publicKey,
            networkPassphrase: network.passphrase,
          },
        );

        if (result.signedTxXdr && result.signedTxXdr !== "") {
          return result.signedTxXdr;
        }
      } catch (error: any) {
        if (error?.message) {
          setInvokeError({ message: error?.message, methodType: "sign" });
        }
      } finally {
        setIsExtensionLoading(false);
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
    const getContractData = async () => {
      if (wasmBinary) {
        const data = await getWasmContractData(wasmBinary);

        if (data?.contractspecv0.xdr) {
          const contractSpec = new contract.Spec(data.contractspecv0.xdr);
          setContractSpec(contractSpec);
        }
      }
    };

    getContractData();
  }, [wasmBinary]);

  useEffect(() => {
    if (contractSpec) {
      const schema = dereferenceSchema(
        contractSpec?.jsonSchema(funcName) as JSONSchema7,
        funcName,
      );

      setDereferencedSchema(schema);
    }
  }, [contractSpec, funcName]);

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

  const handleSubmit = async () => {
    if (!prepareTxData?.transactionXdr) {
      setInvokeError({
        message: "No transaction data available to sign",
        methodType: "submit",
      });
      return;
    }

    resetSimulateState();
    resetSubmitState();

    trackEvent(TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SUBMIT, {
      funcName: formValue.function_name,
    });

    try {
      const signedTxXdr = await signTx(prepareTxData.transactionXdr);

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
        methodType: "submit",
      });
    }
  };

  const handleSimulate = async () => {
    // reset
    setInvokeError(null);
    resetSimulateState();
    resetSubmitState();
    resetPrepareTx();

    try {
      // fetch sequence number first
      await fetchSequenceNumber();

      if (!sequenceNumberData) {
        throw new Error("Failed to fetch sequence number. Please try again.");
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
        seq_num: sequenceNumberData,
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

      const { xdr, error: simulateError } = getTxnToSimulate(
        formValue,
        txnParams,
        sorobanOperation,
        network.passphrase,
      );

      if (xdr) {
        simulateTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: xdr,
          headers: getNetworkHeaders(network, "rpc"),
          xdrFormat,
        });

        // using prepareTransaction instead of assembleTransaction because
        // assembleTransaction requires an auth, but signing for simulation is rare
        prepareTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: xdr,
          networkPassphrase: network.passphrase,
          headers: getNetworkHeaders(network, "rpc"),
        });

        trackEvent(
          TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE_SUCCESS,
          {
            funcName: formValue.function_name,
          },
        );
      }

      if (simulateError) {
        setInvokeError({ message: simulateError, methodType: "simulate" });

        trackEvent(
          TrackingEvent.SMART_CONTRACTS_EXPLORER_INVOKE_CONTRACT_SIMULATE_ERROR,
          {
            funcName: formValue.function_name,
          },
        );
      }
    } catch (error: any) {
      setInvokeError({
        message:
          error?.message || "Failed to simulate transaction. Please try again.",
        methodType: "simulate",
      });
    }
  };

  const renderTitle = (name: string, description?: string) => (
    <>
      <Text size="sm" as="div" weight="bold">
        {name}
      </Text>
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
    const disabled = !isGetFunction && !Object.keys(formValue.args).length;
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
              onClick={handleSimulate}
            >
              Simulate
            </Button>

            <Button
              size="md"
              variant="secondary"
              isLoading={isExtensionLoading || isSubmitRpcPending}
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Submit
            </Button>

            <Button
              size="md"
              variant="secondary"
              isLoading={isExtensionLoading || isSubmitRpcPending}
              // disabled={isSubmitDisabled}
              onClick={() => {
                setFormValue({
                  contract_id: formValue.contract_id,
                  function_name: formValue.function_name,
                  args: {},
                });
              }}
            >
              Reset
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
