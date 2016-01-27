import React from 'react';
import TextPicker from './TextPicker';

export default function PositiveIntPicker(props) {
  return <TextPicker
    {...props}
    validator={(value) => {
      if (value.charAt(0) === '-') {
        return 'Expected a positive number or zero.';
      } else if (!value.match(/^[0-9]*$/g)) {
        return 'Expected a whole number.';
      }

      if (typeof props.validator !== 'undefined') {
        return props.validator(value);
      }
    }}
  />
}
