"use client";

import { Select } from "@stellar/design-system";

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

export const FiltersPicker = ({ id, value, onChange }: FiltersPickerProps) => {
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

  const onUpdate = (val: any, prop: string) => {
    onChange({
      ...value,
      [prop]: [...val],
    });
  };

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
              contract_ids: [""],
              topics: [""],
            });
          } else {
            onChange(undefined);
          }
        }}
      >
        <option value="">Select filters type</option>

        {filtersTypeFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </Select>

      <ExpandBox isExpanded={Boolean(value?.type)} offsetTop="sm">
        <Box gap="sm">
          <MultiPicker
            id="contract_ids"
            label="Contract IDs (up to 5)"
            value={value?.contract_ids}
            onChange={(val) => onUpdate(val, "contract_ids")}
            validate={validate.getContractIdError}
            placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
            limit={5}
          />

          <MultiPicker
            id="topics"
            label="Topics (up to 5)"
            value={value?.topics}
            onChange={(val) => onUpdate(val, "topics")}
            validate={validate.getArrayOfStringsError}
            placeholder="Ex: ['AAAADwAAAAh0cmFuc2Zlcg==', '*', '*', '*']"
            limit={5}
          />
        </Box>
      </ExpandBox>
    </Box>
  );
};
