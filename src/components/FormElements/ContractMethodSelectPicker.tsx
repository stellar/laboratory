"use client";

import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/SmartContractJsonSchema";
import { ExpandBox } from "@/components/ExpandBox";

import { SorobanInvokeValue } from "@/types/types";
import { TrackingEvent } from "@/metrics/tracking";
import { trackEvent } from "@/metrics/tracking";

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

      trackEvent(TrackingEvent.TRANSACTION_BUILD_INVOKE_CONTRACT, {
        funcName: e.target.value,
      });

      onChange({
        ...value,
        function_name: e.target.value,
        args: {},
      });
    }
  };

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
          <JsonSchemaForm
            name={selectedMethod}
            value={value}
            onChange={onChange}
            funcSchema={spec.jsonSchema(selectedMethod)}
          />
        ) : null}
      </ExpandBox>
    </Box>
  );
};
