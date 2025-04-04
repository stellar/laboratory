import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchema/JsonSchemaForm";
import { ExpandBox } from "@/components/ExpandBox";

import { SorobanInvokeValue } from "@/types/types";

// @todo for testing
// comment it out before committing
// remove it before merging into main
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

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
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setSelectedMethod(e.target.value);

      onChange({
        ...value,
        function_name: e.target.value,
        args: {},
      });
    }
  };

  console.log("[ContractMethodSelectPicker] value: ", value);

  return (
    <Box gap="md">
      <Select
        fieldSize="md"
        label="Select a method"
        id={id}
        value={selectedMethod}
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
      <ExpandBox isExpanded={Boolean(selectedMethod)} offsetTop="sm">
        {selectedMethod && spec.jsonSchema(selectedMethod) ? (
          <>
            <JsonSchemaForm
              name={selectedMethod}
              value={value}
              onChange={onChange}
              spec={spec}
              funcSchema={spec.jsonSchema(selectedMethod)}
            />
            {/* 
            // @todo for testing
            // comment it out before committing
            // remove it before merging into main
            */}
            <Form
              schema={spec.jsonSchema(selectedMethod)}
              validator={validator}
            />
          </>
        ) : null}
      </ExpandBox>
    </Box>
  );
};
