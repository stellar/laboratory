import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

export default function SequencePicker(props) {
  let {value, onUpdate} = props;

  return <PositiveIntPicker
    value={value}
    placeholder='Amount in stroops (1 kin = 10,000 stroops)'
    onUpdate={(value) => onUpdate(value)}
    />
}
