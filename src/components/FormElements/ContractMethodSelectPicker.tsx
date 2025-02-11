import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import type { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchemaForm";

// @todo for testing
// comment it out before committing
// remove it before merging into main
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

import { AnyObject } from "@/types/types";

// @todo for now
import { useStore } from "@/store/useStore";
import { INITIAL_OPERATION } from "@/constants/transactionOperations";
import { invert } from "lodash";

export const ContractMethodSelectPicker = ({
  methods,
  spec,
  id,
}: {
  methods: string[];
  spec: contract.Spec;
  id: string;
}) => {
  const { transaction } = useStore();
  const { updateSorobanBuildOperation } = transaction;
  const { soroban } = transaction.build;
  const { operation: sorobanOperation } = soroban;

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [funcSpec, setFuncSpec] = useState<JSONSchema7 | undefined>(undefined);

  // console.log("[ContractMethodSelectPicker] funcSpec: ", funcSpec);

  // sorobanOperation
  // params:
  // {
  //   invoke_contract: contract_address,
  //   function_name: function_name,
  //   args: args
  // }

  const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSorobanBuildOperation(INITIAL_OPERATION);

    setSelectedValue(e.target.value);

    // https://stellar.github.io/js-stellar-sdk/module-contract.Spec.html#jsonSchema
    // The schema provided will be a reference to the function schema
    const selectedFuncSchema = spec.jsonSchema(e.target.value);

    setFuncSpec(selectedFuncSchema);

    console.log("sorobanOperation:", sorobanOperation);

    updateSorobanBuildOperation({
      ...sorobanOperation,
      params: {
        ...sorobanOperation.params,
        contract_method: {
          name: e.target.value,
          args: {},
        },
      },
    });
  };

  const handleArgChange = (argObj: AnyObject, label: string, val: string) => {
    const { params } = sorobanOperation;

    console.log("[handleArgChange] sorobanOperation: ", sorobanOperation);
    console.log("[handleArgChange] argObj: ", argObj);
    console.log(
      "[handleArgChange] params.contract_method: ",
      params.contract_method,
    );

    updateSorobanBuildOperation({
      ...sorobanOperation,
      params: {
        ...params,
        contract_method: {
          ...params.contract_method,
          args: {
            ...(params.contract_method.args || {}),
            [label]: val,
          },
        },
      },
    });
  };

  return (
    <Box gap="md">
      <Select
        fieldSize="md"
        label="Select a function method"
        id={id}
        value={selectedValue}
        onChange={selectOnChange}
      >
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </Select>
      <>
        {funcSpec ? (
          <>
            <JsonSchemaForm
              schema={funcSpec}
              name={selectedValue}
              onChange={handleArgChange}
              schemaValue={sorobanOperation.params.contract_method.args}
            />
            {/* 
            // @todo for testing
            // comment it out before committing
            // remove it before merging into main
            */}
            <Form schema={funcSpec} validator={validator} />
          </>
        ) : null}
      </>
    </Box>
  );
};
