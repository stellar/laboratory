import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import map from "lodash/map";
import React from "react";

// MultiPicker is a compound picker interface that ensures there is always
// enough rows for the user to add more data. MultiPicker accomplishes this
// by making sure there is only one consecutive empty picker at the end.
//
// An empty element is defined as null, undefined, or ''. This means that only
// string value pickers (like PositiveIntPicker but not AssetPicker) can be
// used inside the MultiPicker. For non string values with no way to empty the
// value (such as radio buttons that can't be cleared), use ManualMultiPicker.

// @param {array} props.value - Array of values. If empty or non array, then it
//   will default to a one element array. The length of the array will be
//   normalized to have one empty element at the end.
// @param {function} props.onUpdate - Picker callback function called when the values change.

type Value = string | undefined;

type Values = Value[];

// Updates a value of the array at a specific index
const updateValueAt = (values: Values, index: number, newValue: Value) => {
  values = values.slice();
  values[index] = newValue;
  return values;
};

const isEmpty = (value: Value) =>
  value === null || isUndefined(value) || value === "";

const arelastTwoEmpty = (values: Values) =>
  isEmpty(values[values.length - 1]) && isEmpty(values[values.length - 2]);

// Makes sure there is only one consecutive trailing element in the value array.
// Does not mutate value.
const adjustTrailingEmptyElements = (values: Values) => {
  values = values.slice();

  // Add a trailing empty element. May be removed in the next step
  // This is to ensure that we have at least one trailing empty element. In many
  // cases, this will cause two trailing empty elements, but it will be removed
  // in the next step.
  values.push("");

  // Remove trailing empty elements until there is only one trailing empty element.
  // This makes sure we will only have one consecutive trailing element (especially)
  // remove the defensive one we just added before.
  while (values.length > 1 && arelastTwoEmpty(values)) {
    values.pop();
  }

  return values;
};

interface MultiPickerProps {
  component: React.ComponentType<
    { onUpdate: (val: Value) => void } & React.InputHTMLAttributes<"input">
  >;
  onUpdate: (val: Values) => void;
  value: string[];
}

export const MultiPicker = ({
  component,
  onUpdate,
  value,
}: MultiPickerProps) => {
  if (!isArray(value)) {
    value = [];
  }

  const normalizedValues = adjustTrailingEmptyElements(value);
  const SingleComponent = component;

  return (
    <div>
      {map(normalizedValues, (singleValue, index) => {
        return (
          <SingleComponent
            onUpdate={(newValue: Value) =>
              onUpdate(updateValueAt(normalizedValues, index, newValue))
            }
            value={singleValue}
            className="picker--spaceBottom"
            key={index}
          />
        );
      })}
    </div>
  );
};
