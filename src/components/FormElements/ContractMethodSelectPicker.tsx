import { useState } from "react";

import { Select } from "@stellar/design-system";

export const ContractMethodSelectPicker = ({
  methods,
  id,
}: {
  methods: string[];
  id: string;
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  return (
    <Select
      fieldSize="md"
      label="Select a function method"
      id={id}
      value={selectedValue}
      onChange={onChange}
    >
      {methods.map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </Select>

    // @TODO
    // Render func args
  );
};
