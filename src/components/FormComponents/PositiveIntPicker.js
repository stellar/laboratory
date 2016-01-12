import React from 'react';
import PickerError from './PickerError';

export default function PositiveIntPicker(props) {
  let {value, onUpdate} = props;

  return <div>
    <input type="text"
      value={value}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      placeholder={props.placeholder}
      className="picker picker--textInput" />
    <PickerError message={validator(value)} />
  </div>
}

function validator(value) {
  if (!_.isString(value) || value.length === 0) {
    return;
  }
  if (value.charAt(0) === '-') {
    return 'Expected a positive number.';
  } else if (!value.match(/^[0-9]*$/g)) {
    return 'Expected a whole number.';
  }
}
