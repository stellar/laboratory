"use client";

import { useStore } from "@/store/useStore";
import { Input, Button, Select } from "@stellar/design-system";
import { useState } from "react";

export default function FundAccount() {
  const {
    account: { value, update, updateNested, reset },
  } = useStore();

  const [testValue, setTestValue] = useState(value);

  const handleUpdateNested = (event: any) => {
    const val = event.target.value;
    let submitValue = {
      nestedValue1: "AAA",
      nestedValue2: 111,
    };

    if (val === "Two") {
      submitValue = {
        nestedValue1: "BBB",
        nestedValue2: 222,
      };
    }

    updateNested(submitValue);
  };

  return (
    <div>
      Fund Account
      <div>
        <div>{`Test value: ${value}`}</div>

        <p>Store value is updated on blur</p>

        <Input
          id="test-1"
          fieldSize="sm"
          value={testValue}
          onChange={(event) => setTestValue(event.target.value)}
          onBlur={(event) => update(event.target.value)}
          label="Value"
        />

        <p>Testing nested object update</p>

        <Select
          id="select-1"
          fieldSize="sm"
          onChange={handleUpdateNested}
          label="Nested value"
        >
          <option></option>
          <option value="One">One</option>
          <option value="Two">Two</option>
        </Select>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            reset();
            setTestValue("");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
