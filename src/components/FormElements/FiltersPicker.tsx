import { Link, Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ExpandBox } from "@/components/ExpandBox";
import { MultiPicker } from "@/components/FormElements/MultiPicker";

import { validate } from "@/validate";

import { AnyObject, FiltersObject, FiltersType } from "@/types/types";

type FiltersPickerProps = {
  id: string;
  value: FiltersObject;
  onChange: (value: FiltersObject | undefined) => void;
  error: AnyObject | undefined;
};

export const FiltersPicker = ({
  id,
  value,
  onChange,
  error,
}: FiltersPickerProps) => {
  const filtersTypeFields: { id: string; label: string }[] = [
    {
      id: "system",
      label: "System",
    },
    {
      id: "contract",
      label: "Contract",
    },
    {
      id: "diagnostic",
      label: "Diagnostic",
    },
  ];

  return (
    <Box gap="sm">
      <Select
        id={`${id}-type`}
        fieldSize="md"
        label="Filters Type"
        value={value?.type}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value as FiltersType;

          if (val) {
            onChange({
              type: val,
              contract_ids: [],
              topics: [],
            });
          } else {
            onChange(undefined);
          }
        }}
      >
        <option>Select filters type</option>

        {filtersTypeFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </Select>

      {/* <ExpandBox isExpanded={Boolean(value?.type)} offsetTop="sm">
        <Box gap="sm">
          <MultiPicker
            id="signer"
            label="Add Signer"
            value={value?.contract_ids}
            onUpdate={onUpdateSecretInputs}
            validate={validate.contractId}
            placeholder="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
            rightElement={<Link onClick={} />}
          />

          <MultiPicker
            id="signer"
            label="Add Signer"
            value={value?.topics}
            onUpdate={onUpdateSecretInputs}
            validate={validate.secretKey}
            placeholder="['AAAADwAAAAh0cmFuc2Zlcg==', '*', '*', '*']"
            rightElement={<Link onClick={} />}
          />
        </Box>
      </ExpandBox> */}
    </Box>
  );
};
