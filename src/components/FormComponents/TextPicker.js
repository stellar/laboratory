import React from "react";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import PickerError from "./PickerError";

export default function TextPicker(props) {
  let { value, onUpdate, validator } = props;
  let errorMessage;

  let validatorIsPresent = isFunction(validator);
  let valueIsNonEmpty = isString(value) && value.length > 0;
  if (validatorIsPresent && valueIsNonEmpty) {
    errorMessage = validator(value);
  }

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onUpdate(event.target.value);
        }}
        placeholder={props.placeholder}
        className={`picker picker--textInput ${props.className}`}
      />
      <PickerError message={errorMessage} />
    </div>
  );
}
