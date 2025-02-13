import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";
import type { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchemaForm";
import { ExpandBox } from "@/components/ExpandBox";

// @todo for testing
// comment it out before committing
// remove it before merging into main
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
export const ContractMethodSelectPicker = ({
  methods,
  spec,
  id,
}: {
  methods: string[];
  spec: contract.Spec;
  id: string;
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [funcSpec, setFuncSpec] = useState<JSONSchema7 | undefined>(undefined);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);

    if (e.target.value) {
      const selectedFuncSchema = spec.jsonSchema(e.target.value);
      setFuncSpec(selectedFuncSchema);
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
        onChange={onChange}
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
            <JsonSchemaForm schema={funcSpec} name={selectedValue} />
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
