import { RadioPicker } from "@/components/RadioPicker";

export const OrderPicker = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (optionId: string | undefined) => void;
}) => {
  // TODO: add optional suffix to the label
  return (
    <RadioPicker
      label="Order"
      value={value}
      onChange={onChange}
      options={[
        { id: "asc", label: "Asc" },
        { id: "desc", label: "Desc" },
      ]}
    />
  );
};
