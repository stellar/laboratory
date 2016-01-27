import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

export default function Unsigned8bitIntPicker(props) {
  return <PositiveIntPicker
    {...props}
    validator={(value) => {
      if (value >= 255) {
        return 'Expected a number between 0 and 255 (inclusive).';
      }
    }}
  />
}
