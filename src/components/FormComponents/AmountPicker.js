import React from 'react';
import _ from 'lodash';
import PickerError from './PickerError';

export default function AmountPicker(props) {
  let {value, onUpdate} = props;
  return <div>
    <input type="text"
      value={value}
      placeholder={props.placeholder}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      className="picker picker--textInput" />
    <PickerError message={validator(value)} />
  </div>
}

function validator(value) {
  if (!_.isString(value) || value.length === 0) {
    return;
  }

  if (value.charAt(0) === '-') {
    return 'Amount can only be a positive number.';
  } else if (!value.match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
    return 'Amount can only contain numbers and a period for the decimal point.';
  } else if (value.match(/\.([0-9]){8,}$/g)) {
    return 'Amount can only support a precision of 7 decimals.';
  }
}
