import { useEffect, useState } from "react";
import { Button, Card, Text } from "@stellar/design-system";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { JSONSchema7 } from "json-schema";

import { useStore } from "@/store/useStore";
import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";
import { useAccountSequenceNumber } from "@/query/useAccountSequenceNumber";
import { useSimulateTx } from "@/query/useSimulateTx";

import { DereferencedSchemaType } from "@/constants/jsonSchema";

import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";

import * as StellarXdr from "@/helpers/StellarXdr";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { renderWasmStatus } from "@/helpers/renderWasmStatus";
import { getWasmContractData } from "@/helpers/getWasmContractData";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";

import { Box } from "@/components/layout/Box";
import { JsonSchemaFormRenderer } from "@/components/JsonSchema/JsonSchemaFormRenderer";

import {
  AnyObject,
  ContractInfoApiResponse,
  Network,
  SorobanInvokeValue,
  EmptyObj,
} from "@/types/types";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { TransactionBuildParams } from "@/store/createStore";

import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { parseJsonString } from "@/helpers/parseJsonString";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";
import { PrettyJson } from "@/components/PrettyJson";

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
  const { wasm: wasmHash } = infoData;
  const [xdr, setXdr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCodeWrapped, setIsCodeWrapped] = useCodeWrappedSetting();

  const {
    data: sequenceNumberData,
    error: sequenceNumberError,
    refetch: fetchSequenceNumber,
    isFetching: isFetchingSequenceNumber,
    isLoading: isLoadingSequenceNumber,
  } = useAccountSequenceNumber({
    publicKey: walletKit?.publicKey || "",
    horizonUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
  });

  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  const {
    data: wasmBinary,
    error: wasmBinaryError,
    isLoading: isWasmBinaryLoading,
    isFetching: isWasmBinaryFetching,
    // refetch: fetchWasmBinary,
  } = useWasmBinaryFromRpc({
    wasmHash: wasmHash || "",
    rpcUrl: network.rpcUrl || "",
    isActive: Boolean(network.passphrase && wasmHash),
  });

  const isXdrInit = useIsXdrInit();

  const getXdrJson = (xdr: string) => {
    const xdrType = XDR_TYPE_TRANSACTION_ENVELOPE;

    if (!(isXdrInit && xdr)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdr);

      return {
        jsonString: xdrJson,
        error: "",
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}`,
      };
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

  const [formValue, setFormValue] = useState<SorobanInvokeValue>({
    contract_id: infoData.contract,
    function_name: funcName,
    args: {},
  });
  const [formError, setFormError] = useState<AnyObject>({});

  const handleChange = (value: SorobanInvokeValue) => {
    setFormValue(value);
  };

  // const wasmStatus = renderWasmStatus({
  //   wasmHash: wasmHash || "",
  //   rpcUrl: network.rpcUrl || "",
  //   isLoading: isWasmBinaryFetching || isWasmBinaryLoading,
  //   error: wasmBinaryError,
  // });

  // if (wasmStatus) {
  //   return wasmStatus;
  // }

  const isSimulating = isFetchingSequenceNumber || isLoadingSequenceNumber;

  const handleSubmit = () => {
    console.log(formValue);
  };

  const handleSimulate = () => {
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

    if (network.rpcUrl && xdr) {
      simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr,
        headers: getNetworkHeaders(network, "rpc"),
      });
    }

    if (error) {
      setError(error);
    }

    setXdr(xdr);

    console.log("xdr: ", xdr);
    console.log("simulateTxData: ", simulateTxData);
  };

  const renderTitle = (name: string, description?: string) => (
    <>
      <Text size="sm" as="div" weight="bold">
        {name}
      </Text>
      {description ? (
        <Text size="sm" as="div">
          {description}
        </Text>
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
      <div>
        {renderTitle(funcName, dereferencedSchema?.description)}
        {formValue.contract_id &&
          formValue.function_name &&
          dereferencedSchema && (
            <JsonSchemaFormRenderer
              name={funcName}
              schema={dereferencedSchema as JSONSchema7}
              formData={formValue}
              onChange={handleChange}
              formError={formError}
              setFormError={setFormError}
              parsedSorobanOperation={formValue}
            />
          )}
      </div>
    );
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
              !Object.keys(formValue.args).length && !walletKit?.publicKey
            }
            isLoading={isSimulating}
            onClick={handleSimulate}
          >
            Simulate
          </Button>

          <Button
            size="md"
            variant="secondary"
            disabled={
              !Object.keys(formValue.args).length && !walletKit?.publicKey
            }
            onClick={() => {
              // noop
            }}
          >
            Submit
          </Button>
        </Box>
        {xdr ? (
          <Box gap="md">
            <div
              data-testid="simulate-tx-response"
              className={`PageBody__content PageBody__scrollable ${simulateTxData?.result?.error ? "PageBody__content--error" : ""}`}
            >
              <PrettyJsonTransaction
                json={simulateTxData}
                xdr={xdr}
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
        ) : null}
      </Box>
    </Card>
  );
};
