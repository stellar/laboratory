import { RadioPicker } from "@/components/RadioPicker";

type OrderPickerProps = {
  id: string;
  selectedOption: string | undefined;
  value: string | undefined;
  onChange: (optionId: string | undefined, optionValue?: string) => void;
  labelSuffix?: string | React.ReactNode;
};

export const OrderPicker = ({
  id,
  selectedOption,
  onChange,
  labelSuffix,
}: OrderPickerProps) => {
  return (
    <RadioPicker
      id={id}
      selectedOption={selectedOption}
      label="Order"
      labelSuffix={labelSuffix}
      onChange={onChange}
      options={[
        { id: "asc", label: "Asc", value: "asc" },
        { id: "desc", label: "Desc", value: "desc" },
      ]}
    />
  );
};
