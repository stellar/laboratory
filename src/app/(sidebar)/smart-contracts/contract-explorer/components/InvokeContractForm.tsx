import { useState } from "react";
import { Button, Card, Text } from "@stellar/design-system";
import { JSONSchema7 } from "json-schema";

import { DereferencedSchemaType } from "@/constants/jsonSchema";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { renderWasmStatus } from "@/helpers/renderWasmStatus";
import { getTxnToSimulate } from "@/helpers/sorobanUtils";

import { useWasmFromRpc } from "@/query/useWasmFromRpc";

import { Box } from "@/components/layout/Box";
import { JsonSchemaFormRenderer } from "@/components/JsonSchema/JsonSchemaFormRenderer";

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
  const { wasm: wasmHash, contract: contractId } = infoData;

  const {
    data: wasmData,
    error: wasmError,
    isLoading: isWasmLoading,
    isFetching: isWasmFetching,
  } = useWasmFromRpc({
    wasmHash: wasmHash || "",
    contractId: contractId || "",
    networkPassphrase: network.passphrase || "",
    rpcUrl: network.rpcUrl || "",
    isActive: Boolean(network.passphrase && wasmHash),
  });

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
    isLoading: isWasmFetching || isWasmLoading,
    error: wasmError,
  });

  if (wasmStatus) {
    return wasmStatus;
  }

  const schema = wasmData?.spec.jsonSchema(funcName) as JSONSchema7;
  const dereferencedSchema: DereferencedSchemaType = dereferenceSchema(
    schema,
    funcName,
  );

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

  console.log("formValue: ", formValue);

  return (
    <Card>
      <Box gap="md">
        {renderTitle(funcName, schema.description)}

        {formValue.contract_id && formValue.function_name && (
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
              );
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
