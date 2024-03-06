import { RadioPicker } from "@/components/RadioPicker";

export const IncludeFailedPicker = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (optionId: string | undefined) => void;
}) => {
  // TODO: add optional suffix to the label
  return (
    <RadioPicker
      label="Include failed"
      value={value}
      onChange={onChange}
      options={[
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ]}
    />
  );
};
