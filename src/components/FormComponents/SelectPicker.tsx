import isArray from "lodash/isArray";
import map from "lodash/map";

// @param {object|array} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
//
// For array values, the UI label and onUpdate values are the same.
// The benefit of using an array is that it can contain duplicate items.
interface SelectPickerProps {
  className?: string;
  items: string[] | Record<string, string>;
  onUpdate: (input: string) => void;
  placeholder?: string;
  value: string;
}

export const SelectPicker = ({
  className,
  items,
  onUpdate,
  placeholder,
  value,
}: SelectPickerProps) => {
  let optionsList;

  if (isArray(items)) {
    optionsList = map(items, (value, index) => {
      return (
        <option key={index} value={value}>
          {value}
        </option>
      );
    });
  } else {
    optionsList = map(items, (value, index) => {
      return (
        <option key={index} value={index}>
          {value}
        </option>
      );
    });
  }

  let selectPlaceholderClass;

  if (value === "") {
    selectPlaceholderClass = "so-dropdown__select--placeholder";
  }

  return (
    <div className={`so-dropdown ${className}`}>
      <select
        className={
          "picker picker--select so-dropdown__select " + selectPlaceholderClass
        }
        value={value}
        onChange={(event) => onUpdate(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {optionsList}
      </select>
    </div>
  );
};
