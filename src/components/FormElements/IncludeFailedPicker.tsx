import React from "react";
import { RadioPicker } from "@/components/RadioPicker";

type IncludeFailedPickerProps = {
  id: string;
  selectedOption: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (optionId: string | undefined, optionValue?: boolean) => void;
  labelSuffix?: string | React.ReactNode;
};

export const IncludeFailedPicker = ({
  id,
  selectedOption,
  onChange,
  labelSuffix,
}: IncludeFailedPickerProps) => (
  <RadioPicker
    id={id}
    selectedOption={selectedOption}
    label="Include failed"
    labelSuffix={labelSuffix}
    onChange={onChange}
    options={[
      { id: "true", label: "True", value: true },
      { id: "false", label: "False", value: false },
    ]}
  />
);
