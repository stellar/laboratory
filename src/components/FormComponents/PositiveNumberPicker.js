import React from 'react';
import TextPicker from './TextPicker';

export default function PositiveNumberPicker(props) {
  return <TextPicker
    {...props}
    validator={(value) => {
      if (value.charAt(0) === '-') {
        return 'Expected a positive number or zero.';
      } else if (!value.match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
        return 'Expected a positive number with a period for the decimal point.';
      }

      if (typeof props.validator !== 'undefined') {
        return props.validator(value);
      }
    }}
  />
}
