import React from 'react';
import PickerError from './PickerError';

export default function TransactionPicker(props) {
  let {value, onUpdate} = props;

  return <div>
    <input type="text"
      value={value}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      placeholder='Example: 3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889'
      className="picker picker--textInput" />
    <PickerError message={validator(value)} />
  </div>
}

function validator(value) {
  if (!_.isString(value) || value.length === 0) {
    return;
  }
  if (value.match(/^[0-9a-f]{64}$/g) === null) {
    return 'Transaction hash is invalid.';
  };
}
