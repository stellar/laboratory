import React from 'react';
import _ from 'lodash';
import PickerError from './PickerError';

export default function TextPicker(props) {
  let {value, onUpdate, validator} = props;
  let errorMessage;

  let validatorIsPresent = _.isFunction(validator);
  let valueIsNonEmpty = _.isString(value) && value.length > 0;
  if (validatorIsPresent && valueIsNonEmpty) {
    errorMessage = validator(value);
  }

  return <div>
    <input type="text"
      value={value}
      onChange={(event) => {
        onUpdate(event.target.value);
      }}
      placeholder={props.placeholder}
      className={`picker picker--textInput ${props.className}`} />
    <PickerError message={errorMessage} />
  </div>
}
