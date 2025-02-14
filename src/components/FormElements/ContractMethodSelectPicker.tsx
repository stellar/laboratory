import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import type { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchemaForm";
import { ExpandBox } from "@/components/ExpandBox";

import { SorobanInvokeValue } from "@/types/types";

// @todo for testing
// comment it out before committing
// remove it before merging into main
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const cleanupData = (data: any) => {
  if (!data) return {};
  // Only keep function_method if it exists, reset all other fields
  return {
    function_method: data.function_method || "",
  };
};

export const ContractMethodSelectPicker = ({
  value,
  methods,
  spec,
  id,
  onChange,
}: {
  value: SorobanInvokeValue;
  methods: string[];
  spec: contract.Spec;
  id: string;
  onChange: (val: SorobanInvokeValue) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [funcSpec, setFuncSpec] = useState<JSONSchema7 | undefined>(undefined);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const selectedFuncSchema = spec.jsonSchema(e.target.value);
      setSelectedValue(e.target.value);
      setFuncSpec(selectedFuncSchema);

      onChange({
        ...value,
        data: {
          ...cleanupData(value.data),
          function_method: e.target.value,
        },
      });
    } else {
      setFuncSpec(undefined);
    }
  };

  return (
    <Box gap="md">
      <Select
        fieldSize="md"
        label="Select a method"
        id={id}
        value={selectedValue}
        onChange={(e) => {
          onSelectChange(e);
        }}
      >
        <option value="">Select a method</option>

        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </Select>
      <ExpandBox isExpanded={Boolean(selectedValue)} offsetTop="sm">
        {selectedValue && funcSpec ? (
          <>
            <JsonSchemaForm
              schema={funcSpec}
              name={selectedValue}
              value={value}
              onChange={onChange}
            />
            {/* 
            // @todo for testing
            // comment it out before committing
            // remove it before merging into main
            */}
            <Form schema={funcSpec} validator={validator} />
          </>
        ) : null}
      </ExpandBox>
    </Box>
  );
};
