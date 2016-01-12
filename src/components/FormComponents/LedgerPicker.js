import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

export default function LedgerPicker(props) {
  let {value, onUpdate} = props;

  return <PositiveIntPicker
    value={value}
    placeholder='Example: 1714814'
    onUpdate={(value) => onUpdate(value)}
    />
}
