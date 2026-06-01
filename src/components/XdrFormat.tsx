import { RadioPicker } from "./RadioPicker";
import { XdrFormatType } from "@/types/types";

export const XdrFormat = ({
  selectedFormat,
  onChange,
}: {
  selectedFormat: XdrFormatType | string;
  onChange: (format: XdrFormatType) => void;
}) => {
  return (
    <RadioPicker
      id="simulate-tx-xdr-format"
      label="XDR format"
      selectedOption={selectedFormat}
      onChange={(optionId) => {
        onChange(optionId as XdrFormatType);
      }}
      options={[
        { id: "base64", label: "Base64" },
        { id: "json", label: "JSON" },
      ]}
    />
  );
};
