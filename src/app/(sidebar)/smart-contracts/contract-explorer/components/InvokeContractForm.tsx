import { useEffect, useState } from "react";
import { Button, Card, Text } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import { JSONSchema7 } from "json-schema";

import { DereferencedSchemaType } from "@/constants/jsonSchema";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { renderWasmStatus } from "@/helpers/renderWasmStatus";
// import { getTxnToSimulate } from "@/helpers/sorobanUtils";

import { Box } from "@/components/layout/Box";
import { JsonSchemaFormRenderer } from "@/components/JsonSchema/JsonSchemaFormRenderer";

import {
  AnyObject,
  ContractInfoApiResponse,
  Network,
  SorobanInvokeValue,
  EmptyObj,
} from "@/types/types";
import { useWasmBinaryFromRpc } from "@/query/useWasmBinaryFromRpc";
import { getWasmContractData } from "@/helpers/getWasmContractData";

export const InvokeContractForm = ({
  infoData,
  network,
  funcName,
}: {
  infoData: ContractInfoApiResponse;
  network: Network | EmptyObj;
  funcName: string;
}) => {
  const [contractSpec, setContractSpec] = useState<contract.Spec | null>();
  const { wasm: wasmHash } = infoData;

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

  const wasmStatus = renderWasmStatus({
    wasmHash: wasmHash || "",
    rpcUrl: network.rpcUrl || "",
    isLoading: isWasmBinaryFetching || isWasmBinaryLoading,
    error: wasmBinaryError,
  });

  if (wasmStatus) {
    return wasmStatus;
  }

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
            disabled={!Object.keys(formValue.args).length}
            onClick={() => {
              // @TODO could also may be use TX BINDING
              // const { xdr, error } = getTxnToSimulate(
              // formValue,
              // txnParams,
              // sorobanOperation,
              // network.passphrase,
              // );
              // noop
            }}
          >
            Simulate
          </Button>

          <Button
            size="md"
            variant="secondary"
            disabled={!Object.keys(formValue.args).length}
            onClick={() => {
              // noop
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
