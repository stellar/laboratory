import React from 'react';
import PositiveIntPicker from './PositiveIntPicker';

export default function TimestampPicker(props) {
  let {value, placeholder, onUpdate} = props;

  return <PositiveIntPicker
    value={value}
    placeholder={placeholder}
    onUpdate={(value) => onUpdate(value)}
    />
}
