import { Label } from "@stellar/design-system";
import "./styles.scss";

interface RadioPickerProps {
  label?: string | React.ReactNode;
  // TODO: add labelSuffix once SDS is updated
  value: string | undefined;
  onChange: (optionId: string | undefined) => void;
  options: {
    id: string;
    label: string;
  }[];
}

export const RadioPicker = ({
  label,
  value,
  onChange,
  options,
}: RadioPickerProps) => {
  return (
    <div className="RadioPicker">
      {label ? (
        <Label size="md" htmlFor="">
          {label}
        </Label>
      ) : null}
      <div className="RadioPicker__options">
        {options.map((o) => (
          <div key={o.id} className="RadioPicker__item">
            <input
              type="radio"
              id={o.id}
              checked={o.id === value}
              onClick={() => {
                // Clear selection if selected the same
                onChange(o.id !== value ? o.id : undefined);
              }}
            />
            <label htmlFor={o.id}>{o.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
