import React from 'react';
import RadioButtonPicker from './RadioButtonPicker';

export default function OrderPicker(props) {
  let {value, onUpdate} = props;

  return <RadioButtonPicker
    value={value}
    onUpdate={(value) => onUpdate(value)}
    items={{
      'asc': 'asc',
      'desc': 'desc',
    }}
    />
}
