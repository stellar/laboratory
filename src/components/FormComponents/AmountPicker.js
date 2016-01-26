import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

// AmountPicker picks a positive amount. It extends the PositiveIntPicker and
// adds validation rules IN ADDITION to the ones already present in PositiveIntPicker.
export default function AmountPicker(props) {
  return <PositiveIntPicker
    {...props}
    validator={(value) => {
      if (value.charAt(0) === '-') {
        return 'Amount can only be a positive number.';
      } else if (!value.match(/^[0-9]*(\.[0-9]+){0,1}$/g)) {
        return 'Amount can only contain numbers and a period for the decimal point.';
      } else if (value.match(/\.([0-9]){8,}$/g)) {
        return 'Amount can only support a precision of 7 decimals.';
      }
    }}
  />
}
