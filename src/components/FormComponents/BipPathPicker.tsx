import TextPicker from "./TextPicker";

type BipPathPickerProps = {
  className?: string;
  placeholder?: string;
  onUpdate: (val: string) => void;
} & React.InputHTMLAttributes<"input">;

export const BipPathPicker = ({
  className = "",
  placeholder,
  ...props
}: BipPathPickerProps) => (
  <TextPicker
    {...props}
    placeholder={placeholder || "BIP path in format: 44'/148'/0'"}
    validator={(value: string) => {
      const regexp = /44'\/148'\/(\d+)'/;
      const match = regexp.exec(value);

      if (!(match && match[1].length > 0)) {
        return "Invalid BIP path. Please provide it in format 44'/148'/x'. We call 44'/148'/0' the primary account";
      }
      return "";
    }}
    className={className}
  />
);
