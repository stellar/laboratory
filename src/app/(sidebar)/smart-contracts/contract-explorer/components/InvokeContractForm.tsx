import { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Text, Textarea } from "@stellar/design-system";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { ErrorText } from "@/components/ErrorText";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { JsonSchemaFormRenderer } from "@/components/JsonSchema/JsonSchemaFormRenderer";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { RpcErrorResponse } from "@/app/(sidebar)/transaction/submit/components/ErrorResponse";
import { TransactionSuccessCard } from "@/components/TransactionSuccessCard";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";

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
  AnyObject,
  ContractInfoApiResponse,
  Network,
  SorobanInvokeValue,
  EmptyObj,
} from "@/types/types";

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
  const [signedTxXdr, setSignedTxXdr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [formValue, setFormValue] = useState<SorobanInvokeValue>({
    contract_id: infoData.contract,
    function_name: funcName,
    args: {},
  });
  const [formError, setFormError] = useState<AnyObject>({});

  const hasNoErrors = isEmptyObject(formError);

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

  const signTx = async (xdr: string) => {
    if (!walletKitInstance?.walletKit || !walletKit?.publicKey) {
      return;
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
          setSignedTxXdr(result.signedTxXdr);
        }
        setIsExtensionLoading(false);
      } catch (error: any) {
        if (error?.message) {
          setError(error?.message);
        }
        setIsExtensionLoading(false);
        return;
      }
    }
  };

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

  const handleChange = (value: SorobanInvokeValue) => {
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
      return;
    }

    resetSimulateState();
    resetSubmitState();

    if (prepareTxData?.transactionXdr) {
      await signTx(prepareTxData.transactionXdr);
    }

    if (signedTxXdr) {
      submitRpc({
        rpcUrl: network.rpcUrl,
        transactionXdr: signedTxXdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    }
  };

  const handleSimulate = () => {
    // reset
    setError(null);
    resetSimulateState();
    resetSubmitState();
    resetPrepareTx();

    // fetch sequence number
    fetchSequenceNumber();

    const txnParams: TransactionBuildParams = {
      source_account: walletKit?.publicKey || "",
      fee: BASE_FEE,
      seq_num: sequenceNumberData || "",
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
      simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        headers: getNetworkHeaders(network, "rpc"),
      });

      // using prepareTransaction instead of assembleTransaction because
      // assembleTransaction requires an auth, but signing for simulation is rare
      prepareTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    }

    if (error) {
      setError(error);
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

  const renderSchema = () => {
    if (!contractSpec) {
      return null;
    }

    const dereferencedSchema: DereferencedSchemaType = dereferenceSchema(
      contractSpec?.jsonSchema(funcName) as JSONSchema7,
      funcName,
    );

    if (!dereferencedSchema) {
      return null;
    }

    return (
      <Box gap="md">
        {renderTitle(funcName, dereferencedSchema?.description)}
        {formValue.contract_id &&
          formValue.function_name &&
          dereferencedSchema && (
            <JsonSchemaFormRenderer
              name={funcName}
              schema={dereferencedSchema as JSONSchema7}
              onChange={handleChange}
              formError={formError}
              setFormError={setFormError}
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

    if (error) {
      return (
        <div ref={responseErrorEl}>
          <ErrorText errorMessage={error} size="sm" />
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <Box gap="md">
        {renderSchema()}

        <Box
          gap="sm"
          direction="row"
          align="end"
          justify="end"
          addlClassName="ValidationResponseCard__footer"
          wrap="wrap"
        >
          <Button
            size="md"
            variant="tertiary"
            disabled={
              !Object.keys(formValue.args).length ||
              !walletKit?.publicKey ||
              !hasNoErrors
            }
            isLoading={isSimulating}
            onClick={handleSimulate}
          >
            Simulate
          </Button>

          <Button
            size="md"
            variant="secondary"
            isLoading={isExtensionLoading || isSubmitRpcPending}
            disabled={
              isSimulateTxError ||
              isSubmitRpcError ||
              simulateTxData?.result?.error ||
              isSimulating ||
              !walletKit?.publicKey ||
              !hasNoErrors
            }
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>

        <>{renderResponse()}</>
        <>{renderSuccess()}</>
        <>{renderError()}</>
      </Box>
    </Card>
  );
};
