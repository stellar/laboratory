import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchemaForm";
import { ExpandBox } from "@/components/ExpandBox";

import { SorobanInvokeValue } from "@/types/types";

// @todo for testing
// comment it out before committing
// remove it before merging into main
// import Form from "@rjsf/core";
// import validator from "@rjsf/validator-ajv8";

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

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setSelectedValue(e.target.value);

      onChange({
        ...value,
        function_name: e.target.value,
        args: {
          ...value.args,
        },
      });
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
        {selectedValue ? (
          <>
            <JsonSchemaForm
              name={selectedValue}
              value={value}
              onChange={onChange}
              spec={spec}
            />
            {/* 
            // @todo for testing
            // comment it out before committing
            // remove it before merging into main
            */}
            {/* <Form schema={spec.jsonSchema(selectedValue)} validator={validator} /> */}
          </>
        ) : null}
      </ExpandBox>
    </Box>
  );
};
