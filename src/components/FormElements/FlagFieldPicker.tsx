import { Label } from "@stellar/design-system";
import { arrayItem } from "@/helpers/arrayItem";
import { optionsFlagDetails } from "@/helpers/optionsFlagDetails";
import { OptionFlag } from "@/types/types";

interface FlagFieldProps {
  id: string;
  selectedOptions: string[];
  label?: string | React.ReactNode;
  labelSuffix?: string | React.ReactNode;
  onChange: (value: string[]) => void;
  options?: OptionFlag[];
  infoLink?: string;
  infoText?: string | React.ReactNode;
  note?: React.ReactNode;
}

export const FlagFieldPicker = ({
  id,
  selectedOptions,
  label,
  labelSuffix,
  onChange,
  options,
  infoLink,
  infoText,
  note,
}: FlagFieldProps) => {
  if (!options || options.length === 0) {
    return null;
  }

  const details = optionsFlagDetails(options, selectedOptions);

  return (
    <div className="RadioPicker">
      {label ? (
        <Label
          size="md"
          htmlFor=""
          labelSuffix={labelSuffix}
          infoLink={infoLink}
          infoText={infoText}
        >
          {label}
        </Label>
      ) : null}
      <div className="RadioPicker__options">
        {options.map((o) => {
          const opId = `${o.id}-${id}`;

          return (
            <div key={opId} className="RadioPicker__item">
              <input
                type="radio"
                id={opId}
                checked={selectedOptions.includes(o.id)}
                onChange={() => {
                  onChange(arrayItem.add(selectedOptions, o.id));
                }}
                onClick={() => {
                  if (selectedOptions.includes(o.id)) {
                    // Clear selection if selected the same
                    onChange(
                      arrayItem.delete(
                        selectedOptions,
                        selectedOptions.indexOf(o.id),
                      ),
                    );
                  }
                }}
              />
              <label htmlFor={opId}>{o.label}</label>
            </div>
          );
        })}
      </div>

      {details.total > 0 ? (
        <div className="FieldNote FieldNote--note FieldNote--md">{`${details.selections.join(" + ")} = ${details.total}`}</div>
      ) : null}

      {note ? (
        <div className="FieldNote FieldNote--note FieldNote--md">{note}</div>
      ) : null}
    </div>
  );
};
