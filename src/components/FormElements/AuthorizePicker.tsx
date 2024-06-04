import React from "react";
import { RadioPicker } from "@/components/RadioPicker";

type AuthorizePickerProps = {
  id: string;
  selectedOption: string | undefined;
  onChange: (optionId: string | undefined) => void;
  labelSuffix?: string | React.ReactNode;
};

export const AuthorizePicker = ({
  id,
  selectedOption,
  onChange,
  labelSuffix,
}: AuthorizePickerProps) => (
  <RadioPicker
    id={id}
    selectedOption={selectedOption}
    label="Authorize"
    labelSuffix={labelSuffix}
    onChange={onChange}
    options={[
      { id: "0", label: "Unauthorized", value: "0" },
      { id: "1", label: "Authorized", value: "1" },
      {
        id: "2",
        label: "Authorized to maintain liabilities",
        value: "2",
      },
    ]}
  />
);
